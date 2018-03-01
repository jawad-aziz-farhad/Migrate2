import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { SqlDbProvider , FormBuilderProvider , OperationsProvider, ParseDataProvider, ParserProvider } from '../index';
import { SERVER_URL } from '../../config/config';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { StudyData, Rounds, AllStudyData } from '../../models';
/*
  Generated class for the SyncProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Sync {

  private TABLE_NAME: string   = 'Study';
  private TABLE_NAME_1: string = 'Study_Data';
  private TABLE_NAME_2: string = 'Create_Area';
  private TABLE_NAME_3: string = 'Create_Element';
  private TABLE_NAME_4: string = 'Create_Role';

  private offlineAERData$: Array<any> = [];
  private onlineAERData$: Array<any> = [];

  private offlineStudyImages$: Array<any> = [];
  private onlineStudyImages$: Array<any> = [];
  private offlineData$: Array<any> = [];
  private table: string = null;
  private user: any;

  private offlinedataObj = {
    name: null,
    studyStartTime: null,
    studyEndTime: null,
    customerID: null,
    projectID: null,
    locationID: null,
    userID: null,
    rounds: []
  };

  constructor(public modalCtrl: ModalController,
              public sql: SqlDbProvider, 
              public formBuilder: FormBuilderProvider,
              public operations: OperationsProvider ,
              public parseData: ParseDataProvider,
              public parser: ParserProvider,
              public storage: Storage) {
    console.log('Hello SyncProvider Provider');
  }

  /* CHECKING OFFLINE DATA  */
  checkingOfflineData(table){

    this.table = table;
    const data = this.sql.getAllData(table);
    
    data.then((result:any) => {

      if(result.length > 0 ){
        this.offlineAERData$.push(result);
        let endPoint = null; let requests = [];
        
        result.forEach((element,index) => {

          const request = this.formBuilder.initFormForOfflineData(element);
          const data = this.formBuilder.getFormForOfflineData().value;
          
          if(element.position)
            endPoint = 'roles/add';
          else if(element.type)
            endPoint = 'elements/add';
          else 
            endPoint = 'areas/add';

          requests.push(this.operations.offlineRequest(endPoint,data));
       
      });

    this.saveAERData(requests);
   }
   else
     this.checkTable();

  }).catch(error => console.error(JSON.stringify(error)));
    
  }

  saveAERData(requests){

    const forkJoin = Observable.forkJoin(requests);
    
    forkJoin.subscribe(result => {   
      this.onlineAERData$.push(result);
      this.checkingResult(result);
    
    },
    error => this.operations.handleError(error));
  }

  checkingResult(data){

    let errors = [];
    
    data.forEach((element, index) => {
      if(!element.success){
        if(element.code == 11000)
          errors.push(index);
        else
          this.operations.handleError(element);
      }
    });
    console.log("ERRORS: "+JSON.stringify(errors) + " ERRORS LENGTH: "+ errors.length);
    
      
    if(errors.length == 0)
      this.checkTable();
   else
    this.askForUpdateNames(errors, errors[0] , data);
   
  }

  checkTable(){
    if(this.table == this.TABLE_NAME_2)
      this.checkingOfflineData(this.TABLE_NAME_3);
    else if(this.table == this.TABLE_NAME_3)
      this.checkingOfflineData(this.TABLE_NAME_4)  
    else
      this.updateSQLData('data');
  }

  askForUpdateNames(errors,index,result){

    let lastIndex = this.offlineAERData$.length - 1;
    let data = this.offlineAERData$[lastIndex][index];
    
    this.updateName(data).subscribe((result: any) => {
      lastIndex = this.onlineAERData$.length - 1;
      this.offlineAERData$[lastIndex][index].name = result.data.updatedName;
      this.onlineAERData$[lastIndex][index] = result.data;
      errors.splice(0,1);
      if(errors.length == 0)
        this.checkTable();
      else
        this.askForUpdateNames(errors,errors[0],result);
      
    },
    error => {
      console.error("CODE 11000 ENTRY ERROR: "+ JSON.stringify(error));
    });
  }
  
  updateName(data){
    return new Observable(observer => {

      let updatedName = this.openModal(data);
      updatedName.subscribe(result => {
        observer.next(result);
        observer.complete();
      },
      error => console.log("MODAL CLOSED ERROR: " + JSON.stringify(error)));
    });
  }

  /* CONFIRMATION FOR SUBMITTING ALL THE STUDY DATA  */
  openModal(data) {

    return new Observable(observer => {

      let _data = {data: data};
      let modal = this.modalCtrl.create('EditTitlePage', _data, { cssClass: 'inset-modal items-page-modal' });
      
      modal.onDidDismiss(data => {
        setTimeout(() => {
          observer.next(data);
          observer.complete();
        });
      });
  
      modal.present();
    });
  }

  /* UPDATING OFFLINE ENTRIES IN SQLite TABLES(Areas, Elements, Roles, Study_Data) WITH THE LIVE PROPERTIES LIKE name, _id etc.*/
  updateSQLData(updateFor: string){
    let updates = [];
    if(updateFor == 'data')
      updates = this.getAERData();
    else
      updates = this.getImagesData();

    const update = Observable.forkJoin(updates);
    update.subscribe(result => {
      if(updateFor == 'data')
        this.getofflineStudyImages();
      else
        this.getUser();  
    },
    error => console.error("UPDATE ERROR: "+ JSON.stringify(error)));
  }

  getAERData() {

    let updates = [];

    if(this.offlineAERData$.length == 0)
      this.getofflineStudyImages();

    this.offlineAERData$.forEach((element,index) => {
      element.forEach((sub_element,sub_index) => {

        let data = {_id: null, name: null, offline: null , numericID: null };
        let column = null; let table = null;
        
        table  = this.getTable(sub_element);
        column = table.toLowerCase().slice(0, -1);
        data.offline = sub_element._id;

        if(table == 'Areas')
          data._id = this.onlineAERData$[index][sub_index].areaID;
        else if(table == 'Elements')
          data._id = this.onlineAERData$[index][sub_index].elementID; 
        else if(table == 'Roles')
          data._id = this.onlineAERData$[index][sub_index].roleID;   
            
        data.numericID = this.onlineAERData$[index][sub_index].numericID;
        
        data.name = this.offlineAERData$[index][sub_index].name;

        let update = this.sql.updateTable(table ,column , data);
        updates.push(update);

        update = this.sql.updateTable(this.TABLE_NAME_1,column,data);
        updates.push(update);

      });
    });

    return updates;
  }


  getImagesData(){
    let updates = [];
    this.offlineStudyImages$.forEach((element,index) => {
      let data = { path: null, photo : null };
      data.path = this.onlineStudyImages$[index].path;
      data.photo = this.offlineStudyImages$[index].photo;
      let update = this.sql.updateTable(this.TABLE_NAME_1,'photo',data);
      updates.push(update);
    });
    
    return updates;
  }

  getTable(data){
    let table = null;
    if(data.position)
      table = "Roles";
    else if(data.type)
       table = "Elements";
    else
      table = "Areas";
    return table;  
  }

  getofflineStudyImages(){
    this.offlineStudyImages$ = [];
    this.sql.getLikeData(this.TABLE_NAME_1).then((result: any) => {
      if(result.length > 0){
        this.offlineStudyImages$ = result.slice();
        this.uploadImages(result);
      }
      else
        this.getUser();
    })
    .catch(error => {
      console.error("OFFLINE IMAGES ERROR: "+ JSON.stringify(error));
    });
  }


  uploadImages(result){
    let params = {endPoint:'ras_data/study_image' , key :'photo', file: result[0].photo};
    this.operations.uploadFile(params).then(res => {
      let response = JSON.parse(res);
      if(response.success){
        this.onlineStudyImages$.push(response);
        result.splice(0,1);
        if(result.length > 0)
          this.uploadImages(result);
        else
          this.updateSQLData('images');  
      }
    })
    .catch(error => {
      console.error("IMAGE UPLOAD ERROR: " + JSON.stringify(error))
    });
  }

  /* GETTING USER's INFO */
  getUser(){
    this.storage.get('currentUser').then(user => {
      this.user = user;
      this.getOfflineStudies()
    });
  }

  getOfflineStudies(){

    const data = Observable.fromPromise(this.sql.getAllData(this.TABLE_NAME));

    data.subscribe(result => {
      if(result.length > 0){
        this.getOffline_StudyData(result);      
      }
    },
    error => console.error("ALL STUDIES ERROR: "+ JSON.stringify(error)));                
  }

  
  getOffline_StudyData(data){
    const array = [];
    data.forEach((element,index) => {
      const studyData = this.sql.getIDData(this.TABLE_NAME_1,element.id);
      array.push(studyData);
    });

    const getData = Observable.forkJoin(array);
    getData.subscribe(result => {
      console.log("OFFLINE STUDIES DATA: "+ JSON.stringify(result) + "\n\n\n");  
      this.uploadStudyData(data, result);
    },
    error => {
        console.log("ALL STUD DATA ERROR: "+ JSON.stringify(error));
    });
  }

  uploadStudyData(studies, study_data){

    const uploads = [];
    
    studies.forEach((element,index) => {

      let study = element;
      let studydata = study_data[index];
      console.log("\n\nSTUDY: "+ JSON.stringify(study) + "\n\nSTUDY DATA: "+ JSON.stringify(studydata));
      this.buildStudyData(study,studydata);
      const lastIndex = this.offlineData$.length - 1;
      console.log("PARSER DATA: "+ JSON.stringify(this.offlineData$[lastIndex]));
      
      const upload = this.operations.postRequest('ras_data/add' , this.offlineData$[lastIndex]);
      uploads.push(upload);
    
    });

    const upload = Observable.forkJoin(uploads);
    upload.subscribe(result => {
      console.log("ALL STUDY UPLOADS RESULT: " + JSON.stringify(result));
    },
    error => {
      console.error("ALL STUDY ERROR: "+ JSON.stringify(error));
    });

  }

  getStudyData(data){

    let studyData = new StudyData();
    studyData.setArea(data.area);
    studyData.setElement(data.element);
    studyData.setRole(data.role);
    studyData.setFrequency(data.frequency);
    studyData.setNotes(data.notes);
    studyData.setObservationTime(data.observationTime);
    studyData.setPhoto(data.photo);
    studyData.setRating(data.rating);

    return studyData;
  
  }

   /* SETTING VALUES OF STUDY TO OBJECT AND PUSHGING IN ARRAY */
   buildStudyData(study, study_data){

    var element = study;
    console.log("STUDY DETAIL: "+ JSON.stringify(element));
    this.offlinedataObj.name = element.title; 
    this.offlinedataObj.studyStartTime = element.studyStartTime;
    this.offlinedataObj.studyEndTime = element.studyEndTime;
    this.offlinedataObj.customerID = element.customerID;
    this.offlinedataObj.projectID = element.projectID;
    this.offlinedataObj.userID = this.user._id;
    this.offlinedataObj.locationID = element.locationID;
    this.offlineData$.push(this.offlinedataObj);

    this.buildRoundsData(study_data);

  }

  /* BUILDING ROUNDs DATA AND PUSHING IT IN ROUNDS ARRAY */
  buildRoundsData(data) {

    var s_Time = ''; var e_Time = '';
    let rounds = [];
    let lastIndex = this.offlineData$.length - 1;

    data.forEach((element , index) => {
      /* IF TIME IS SAME, THAT MEANS THIS OBSERVATION IS OCCURED IN THE SAME ROUND */
      if(s_Time == element.roundStartTime && e_Time == element.roundEndTime){
        rounds.push(this.getStudyData(element));
        if((index + 1) == data.length){
          this.parser.getRounds().setRoundStartTime(element.roundStartTime)
          this.parser.getRounds().setRoundEndTime(element.roundEndTime);
          this.parser.getRounds().setRoundData(rounds);
          this.offlineData$[lastIndex].rounds.push(this.parser.getRounds());
          this.parser.clearRounds();
          rounds = [];
        }
      }

      else{
        if(rounds.length > 0){
          this.parser.getRounds().setRoundData(rounds);
          this.offlineData$[lastIndex].rounds.push(this.parser.getRounds());
        }
        
        this.parser.clearRounds();
        rounds = [];
        this.parser.getRounds().setRoundStartTime(element.roundStartTime)
        this.parser.getRounds().setRoundEndTime(element.roundEndTime);
        rounds.push(this.getStudyData(element));
      } 
      
      s_Time = element.roundStartTime;
      e_Time = element.roundEndTime;
     
    }); 
    
  }

  /* DROPPING THE FOLLOWING SO NEXT TIME WE ONLY UPDATE THE NEWLY INSERTED DATA */
  dropTables(){

    const table1 = this.sql.getAllData(this.TABLE_NAME);
    const table2 = this.sql.getAllData(this.TABLE_NAME_1);
    const table3 = this.sql.getAllData(this.TABLE_NAME_2);
    const table4 = this.sql.getAllData(this.TABLE_NAME_3);
    const table5 = this.sql.getAllData(this.TABLE_NAME_4);

    const observbeAbleArray = [table1, table2, table3, table4, table5 ];

    const forkJoin = Observable.forkJoin(observbeAbleArray);

    forkJoin.subscribe(result => {
      console.log('UPDATED DATA: '+ JSON.stringify(result));
    },
    error => {
      console.log('UPDATED DATA ERROR: ' + JSON.stringify(error));
    });
  }


}



