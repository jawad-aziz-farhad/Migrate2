import { Storage } from "@ionic/storage";
import { Http } from '@angular/http';
import * as $ from 'jQuery';
/* PROVIDERS  */
import {NetworkProvider , SqlDbProvider , OperationsProvider , LoaderProvider ,
         FormBuilderProvider, ToastProvider, ParserProvider, ParseDataProvider, HeadersProvider } from "../providers/index";
/* MODELS */         
import {StudyData , AllStudyData, Rounds } from '../models/index';

/* STATIC VALUES */
import { SYNC_DONE , MESSAGE , SYNC_DATA_MSG, ERROR, SERVER_URL , BACK_BTN_MESSAGE} from '../config/config';
/* RxJs */
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { forkJoin } from "rxjs/observable/forkJoin";

export class SyncOfflineData {

  protected TABLE_NAME: string   = 'Study';
  protected TABLE_NAME_1: string = 'Study_Data';
  protected TABLE_NAME_2: string = 'Create_Area';
  protected TABLE_NAME_3: string = 'Create_Element';
  protected TABLE_NAME_4: string = 'Create_Role';

  protected user: any;
  protected isMenuOpened: boolean;
  protected lastTimeBackPress: any = 0;
  protected timePeriodToExit: any = 3000;
  
  protected offlinedataObj = {
    name: null,
    studyStartTime: null,
    studyEndTime: null,
    customerID: null,
    projectID: null,
    userID: null,
    rounds: []
  };

  protected offlineData: Array<StudyData> = [];
  protected offlineData$: Array<any> = [];
  protected offlineAERData$: Array<any> = [];
  
  constructor(protected network: NetworkProvider,
              protected sql: SqlDbProvider,
              protected operations: OperationsProvider,
              protected loader: LoaderProvider,
              protected formBuilder: FormBuilderProvider,
              protected toast: ToastProvider,
              protected parseData: ParseDataProvider,
              protected parser: ParserProvider,
              protected headers: HeadersProvider,
              protected storage: Storage,
              public http: Http
              ){}

  /* GETTING CURRENT USER INFO FROM LOCAL STORAGE */
  getUser(){
    this.storage.get('currentUser').then(user => {
      this.offlineData$[0].userID = user._id;
      this.syncData();
    });
  }        

  checkOfflineCreatedAER(){
    let data = [];
    const table1 = this.sql.getAllData(this.TABLE_NAME_2);
    const table2 = this.sql.getAllData(this.TABLE_NAME_3);
    const table3 = this.sql.getAllData(this.TABLE_NAME_4);

    const observbeAbleArray = [table1, table2,table3];

    const forkJoin = Observable.forkJoin(observbeAbleArray);

    forkJoin.subscribe(result => {
      this.offlineAERData$ = result;
      if(result.length > 0){
        this.loader.showLoader(MESSAGE);
        this.makingAER_Request(result);
      }
      else
        this.checkOfflineData();  
    },
    error => {
      console.log('ERROR: ' + JSON.stringify(error));
    });
  }

  makingAER_Request(data){
    let requests = [];
    data.forEach((element, index) => {
        let sub_requests = []; let endPoint = null;
        element.forEach((sub_element,sub_index) => {
             const request = this.formBuilder.initFormForOfflineData(sub_element);
             if(typeof sub_element.areaname !== 'undefined'){
               endPoint = SERVER_URL + 'areas/add';
               sub_requests.push(this.getSingleRequest(endPoint));
            }
            else if(typeof sub_element.description !== 'undefined'){
              endPoint = SERVER_URL + 'elements/add';
              sub_requests.push(this.getSingleRequest(endPoint));
            }
            else if(typeof sub_element.rolename !== 'undefined'){
              endPoint = SERVER_URL + 'roles/add';
              sub_requests.push(this.getSingleRequest(endPoint));
            }
        });
        
        requests.push(sub_requests);
    });

    this.savingAERData(requests);
  }


  getSingleRequest(endPoint): Observable<any> {
     let data = this.formBuilder.getFormForOfflineData().value;
     return this.http.post(`${endPoint}`, data).map(res => res.json());
   }

  savingAERData(requests){
    let results = [];
    requests.forEach((element,index) => {
      const forkJoin = Observable.forkJoin(element);
      forkJoin.subscribe(result => {
        results.push(result);
        if(index == (requests.length -1))
          this.updateStudyData(results);
      },
      error => {
        console.log('ERROR: ' + JSON.stringify(error));
      });
    }); 
  }

  updateStudyData(data){
    let updates = [];
    this.offlineAERData$.forEach((element,index) => {
      element.forEach((sub_element,sub_index) => {
          let column = null; let queryData = {live: null, offline: null };
          if(typeof sub_element.areaname !== 'undefined')
            column = 'area';
          else if(typeof sub_element.description !== 'undefined')
            column = 'element';
          else if(typeof sub_element.rolename !== 'undefined')
            column = 'role';
         queryData.live = data[index][sub_index]._id;
         queryData.offline = this.offlineAERData$[index][sub_index]._id; 
         const update = this.sql.updateTable(this.TABLE_NAME_1, column, queryData);
         updates.push(update);
      });
    });

    const forkJoin = Observable.forkJoin(updates);
    forkJoin.subscribe(result => {
      this.checkOfflineData();
    },
    error => {
      console.log('UPDATE ERROR: ' + JSON.stringify(error));
    });
  }


  /* CHECKING OFFLINE STUDY DATA WHEN INTERNET CONNECTION IS AVAILABLE */ 
  checkOfflineData(){
     this.sql.isDataAvailable(this.TABLE_NAME).then(result => {
        if(result)
          this.getOfflineData(this.TABLE_NAME);        
        else
           console.log('NO DATA AVAILABLE.');
      }).catch(error => {
        console.log('ERROR: ' + JSON.stringify(error));
        return false;
      });
  }
  /* GETTING OFFLINE DATA AND SYNCING IT TO THE SERVER */
  getOfflineData(table){
    this.sql.getAllData(table).then(result => {
        if(result && result.length > 0)
          this.handleStudies(result); 
        else
          console.log('NO DATA AVAILABLE.');
    }).catch(error => {
      this.handleError();
    })
  }


  handleStudies(data){
    if(this.offlineAERData$.length == 0)
      this.loader.showLoader(MESSAGE);  
    /* INITIALIZING ARRAY BEFORE PUSHING DATA INTO IT */
    this.offlineData$ = [];
    $(data).each((index,element) => {
      this.getSingleStudyData(element.id)
    });
  }

  /* GETTING SINGLE STUDY DATA FOR GIVEN ID */
  getSingleStudyData(studyID){
    this.sql.getOfflineStudyData(studyID).then(result => {
      this.buildStudyData(result);
    }).catch(error => {
      this.handleError();
    });
  }

  /* SETTING VALUES OF STUDY TO OBJECT AND PUSHGING IN ARRAY */
  buildStudyData(data){
    var element = data[0];
    this.offlinedataObj.name = element.title; 
    this.offlinedataObj.studyStartTime = element.studyStartTime;
    this.offlinedataObj.studyEndTime = element.studyEndTime;
    this.offlinedataObj.customerID = element.customer.customer_id;
    this.offlinedataObj.projectID = element._id;
    this.offlineData$.push(this.offlinedataObj);

    this.buildRoundsData(data);
  }

  /* BUILDING ROUNDs DATA AND PUSHING IT IN ROUNDS ARRAY */
  buildRoundsData(data) {
    var s_Time = ''; var e_Time = '';

    $(data).each((index, element) => {
      /* IF TIME IS SAME, THAT MEANS THIS OBSERVATION IS OCCURED IN THE SAME ROUND */
      if(s_Time == element.roundStartTime && e_Time == element.roundEndTime){
        this.offlineData.push(this.getData(element));
        if((index + 1) == data.length){
          this.parser.getRounds().setRoundStartTime(element.roundStartTime)
          this.parser.getRounds().setRoundEndTime(element.roundEndTime);
          this.parser.getRounds().setRoundData(this.offlineData);
          this.offlineData$[0].rounds.push(this.parser.getRounds());
          this.parser.clearRounds();
          this.offlineData = [];
        }
      }

      else{
        if(this.offlineData.length > 0){
          this.parser.getRounds().setRoundData(this.offlineData);
          this.offlineData$[0].rounds.push(this.parser.getRounds());
        }
        
        this.parser.clearRounds();
        this.offlineData = [];
        this.parser.getRounds().setRoundStartTime(element.roundStartTime)
        this.parser.getRounds().setRoundEndTime(element.roundEndTime);
        this.offlineData.push(this.getData(element));
      } 
      
      s_Time = element.roundStartTime;
      e_Time = element.roundEndTime;
     
    }); 
    
    this.collectOfflineImage();
  }

  /* GETTING STUDY DATA FROM EACH ELEMENT AND RETURNING IT IN THE FORM OF AN OBJECT */
  getData(element){
    var data = new StudyData();
    data.setArea(element.area);
    data.setElement(element.element);
    data.setRole(element.role);
    data.setRating(element.rating);
    data.setFrequency(element.frequency);
    data.setNotes(element.notes);
    if(element.observationTime.indexOf('NaN') > -1)
    data.setObservationTime("00:02");
    else
      data.setObservationTime(element.observationTime);
    data.setPhoto(element.photo);
    return data;
  }

  /* COLLECTING OFFLINE IMAGES TO UPLOAD THEM TO THE SERVER AND SAVED THE UPLOADED PATHS ON THEIR LOCATIONS */
  collectOfflineImage() {
    var images = [];
    $(this.offlineData$[0].rounds).each((index, element) => {      
        $(element.data).each((sub_index, sub_element) => {
          var imageObj = {roundIndex: null, dataIndex: null, photo: null};
            if(typeof sub_element.photo !== 'undefined' && sub_element.photo !== null && sub_element.photo.indexOf('file:///') > -1) {
              imageObj.photo = sub_element.photo;
              imageObj.dataIndex = sub_index;
              imageObj.roundIndex = index;
              images.push(imageObj);
            }
        });
    });
    
    if(images.length > 0)
      this.uploadAllImages(images);
    
    else
        this.getUser(); 
  }

  /* CHECKING FOR STUDY DATA IMAGES WHICH ARE NOT UPLOADED YET AND UPLOADING THEM */
  uploadAllImages(images) {
    this.uploadImages(images).subscribe(result => {
      this.loader.hideLoader();
      $(result).each((index,element) => {
        var response = JSON.parse(element.response);
        $(images).each((sub_index,sub_element) => {
          if((index == sub_index) && (response.success)){
            this.offlineData$[0].rounds[0].data[sub_element.dataIndex].photo = response.path ;
          }
        });
      });
      
     this.getUser();
     
    },
    error => {
      this.loader.hideLoader();
      this.handleError();
    });
    
  }

  /* COMBINING MULTIPLE OBSERVABLES TO UPLOAD MULTIPLE IMAGES */
  uploadImages(images){
    return Observable.forkJoin(this.makeImageRequests(images)).map((data: any) => {
      return data;
    });
  }

  /* MAKING ARRAY OF OBSERVABLES */
  makeImageRequests(images){
    var observbeAbleArray  = [];
    $(images).each((index,element) => {
      observbeAbleArray.push(this.operations._uploadFile(element.photo));
    });
    return observbeAbleArray;
  }

/* SYNCING DATA TO SERVER */
  syncData() {    
    this.operations.addData(this.offlineData$[0], 'ras_data/add').subscribe(result => {
        console.log("RAS RESULT: " + JSON.stringify(result));
        if(result.success)
          this.dropTable(this.TABLE_NAME);
        else
          this.handleError();
    }),
    error => {
      this.handleError();
      console.log('ERROR: '+ JSON.stringify(error));
    };
  }

  /* DROPPING SQL TABLE AFTER SYNCING DATA */
  dropTable(table){
    this.sql.dropTable(table).then(res => {
      if(table == this.TABLE_NAME)    
        this.dropTable(this.TABLE_NAME_1);
      else if(table == this.TABLE_NAME_1)
        this.dropTable(this.TABLE_NAME_2);
      else if(table == this.TABLE_NAME_2)    
        this.dropTable(this.TABLE_NAME_3);
      else if(table == this.TABLE_NAME_3)    
        this.dropTable(this.TABLE_NAME_4);
      else if(table == this.TABLE_NAME_4){    
      this.loader.hideLoader();
      this.toast.showToast(SYNC_DONE);
      }
    }).catch(error => {
      this.handleError();
      console.error('ERROR: '+ JSON.stringify(error));
    })
  }

    /*HANDLING ERRORS */
  handleError(){
    this.loader.hideLoader();
    this.toast.showToast(ERROR);
  }
   
}