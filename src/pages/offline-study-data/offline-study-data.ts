import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NetworkProvider , SqlDbProvider , OperationsProvider , LoaderProvider , FormBuilderProvider, ToastProvider, ParserProvider} from "../../providers/index";
import { Storage } from "@ionic/storage";
import { StudyData, AllStudyData,  } from '../../models';
import { SYNC_DONE , MESSAGE , SYNC_DATA_MSG, ERROR, INTERNET_ERROR } from '../../config/config';
import { ObservationSummaryPage } from '../observation-summary/observation-summary';
import { Observable } from 'rxjs';
import * as $ from 'jQuery';
import { NewTimerComponent } from '../../components/new-timer/new-timer';
/**
 * Generated class for the OfflineStudyDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offline-study-data',
  templateUrl: 'offline-study-data.html',
})
export class OfflineStudyDataPage {

  private items: Array<StudyData> = [];
  private TABLE_NAME: string = 'Study';
  private TABLE_NAME_1: string = 'Study_Data';
  public data: any;
  public show: boolean;

  private offlinedataObj = {
    name: null,
    studyStartTime: null,
    studyEndTime: null,
    customerID: null,
    projectID: null,
    userID: null,
    rounds: []
  };

  private offlineData: Array<StudyData> = [];
  private offlineData$: Array<any> = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public sql: SqlDbProvider,
              public parser: ParserProvider,
              public loader: LoaderProvider,
              private toast: ToastProvider,
              public network: NetworkProvider,
              private storage: Storage,
              public operations: OperationsProvider) {
    this.show = true;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad OfflineStudyDataPage');
  }

  initView(){
    this.show = false;  
    this.items = [];        
    this.getOfflineData(this.TABLE_NAME); 
  }

  /* GETTING CURRENT USER INFO FROM LOCAL STORAGE */
  getUser(){
    this.storage.get('currentUser').then(user => {
      this.offlineData$[0].userID = user._id;
      this.syncData();
    });
  }

  /* GETTING OFFLINE DATA AND SYNCING IT TO THE SERVER */
  getOfflineData(table){
    this.loader.showLoader(MESSAGE);
    this.sql.getAllData(table).then(result => {
        if(result && result.length > 0)
          this.handleStudies(result); 
        else{
          console.log('NO DATA AVAILABLE.');
          this.show = true;
        }
    }).catch(error => {
      this.loader.hideLoader();
      this.handleError();
    });
  }

  handleStudies(data){
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
    
    this.loader.hideLoader();
    this.items = this.offlineData$[0].rounds[0].data;
    this.show = true;
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

  /* CHECKING CONNECTION BEFORE SYNCING DATA */
  checkConnection(){
      if(this.network.isInternetAvailable())
        this.collectOfflineImage();
      else
        this.toast.showBottomToast(INTERNET_ERROR);  
  }

  /* COLLECTING OFFLINE IMAGES TO UPLOAD THEM TO THE SERVER AND SAVED THE UPLOADED PATHS ON THEIR LOCATIONS */
  collectOfflineImage() {
    this.loader.showLoader(SYNC_DATA_MSG);
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
          this.dropTable();
        else
          this.handleError();
    }),
    error => {
      this.loader.hideLoader();
      this.handleError();
      console.log('ERROR: '+ JSON.stringify(error));
    };
  }

  /* DROPPING SQL TABLE AFTER SYNCING DATA */
  dropTable(){
    this.sql.dropTable(this.TABLE_NAME_1).then(res => {
      this.loader.hideLoader();
      this.toast.showToast(SYNC_DONE);
    }).catch(error => {
      this.loader.hideLoader();
      this.handleError();
      console.error('ERROR: '+ JSON.stringify(error));
    })
  }

  /*HANDLING ERRORS */
  handleError(){
    this.loader.hideLoader();
    this.toast.showToast(ERROR);
  }

    /* SHOWING SUMMARY OF SINGLE ITEM */
    showSummary(item){
      this.navCtrl.push(ObservationSummaryPage, {item: item});
    }



}
