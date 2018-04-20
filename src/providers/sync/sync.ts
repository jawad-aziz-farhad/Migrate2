import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { SqlDbProvider , FormBuilderProvider , OperationsProvider, ParseDataProvider, LoaderProvider } from '../index';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Data } from '../../models';
import { Storage } from '@ionic/storage';
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
  private result: Array<any> = [];
  public isDatSynced: boolean = false;
  
  constructor(public modalCtrl: ModalController,
              public sql: SqlDbProvider, 
              public formBuilder: FormBuilderProvider,
              public operations: OperationsProvider ,
              public parseData: ParseDataProvider,
              public loader: LoaderProvider,
              public storage: Storage) {
    console.log('Hello SyncProvider Provider');
  }

  
  /* SYNCING OFFLINE DATA */
  syncOfflinedata() {    
   return new Observable(observer => {
     this.checkingOfflineData(this.TABLE_NAME_2);
     this.checkSycning(observer);
    });
  }

  /* CHECKING AFTER EACH SECOND WHETER SYNCING IS DONE OR NOT  */
  checkSycning(observer){
    setTimeout(() => {
      if(this.isDatSynced){
       observer.next(this.result);
        observer.complete();
     }
     else
        this.checkSycning(observer);
   }, 1000);
    

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

          this.formBuilder.initFormForOfflineData(element);
          const data = this.formBuilder.getFormForOfflineData();
          
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

  }).catch(error => this.handleError(error));
    
  }

  /* CATCHING ERROR */
  catchError(error){
    return Observable.throw(error.json());
  }

  /* SAVING Area, Element, Role INFORMATION */
  saveAERData(requests){

    const forkJoin = Observable.forkJoin(requests);    
    forkJoin.subscribe(result => {   
      this.onlineAERData$.push(result);
      this.checkingResult(result);
    },
    error => this.operations.handleError(error));
  }

  /* CHECKING RESULT FOR THE UPLOADED DATA */
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

  /* ASKING TO UPDATE THE NAME OF ENTRIES WHICH GOT ERROR CODE 11000 FROM SERVER AFTER UPLOADING */
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
    error => this.handleError(error));
  }
  
  /* UPDATING NAME OF SINGLE ENTRY WHICH GOT ERROR CODE OF 11000 */
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
        if(data){
          setTimeout(() => {
            observer.next(data);
            observer.complete();
          });
        }
        else{
          observer.next(null);
          observer.complete();
        }
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
        this.getOfflineStudies();  
    },
    error => this.handleError(error));
  }

  /* GETTING AND UPDATING OFFLINE DATA OF TABLES(Areas, Elements, Roles) WITH THE LIVE DATA */
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

  /* GETTING OFFLINE IMAGES */
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

  /* RETURNING TABLE NAME ONT THE BASE OF OBJECT PROPERTIES */
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

  /* GETTING OFFLINE STUDY IMAGES IF EXIST */
  getofflineStudyImages(){
    this.offlineStudyImages$ = [];
    this.sql.getLikeData(this.TABLE_NAME_1).then((result: any) => {
      if(result.length > 0){
        this.offlineStudyImages$ = result.slice();
        this.uploadImages(result);
      }
      else
        this.getOfflineStudies();
    })
    .catch(error => this.handleError(error));
  }

  /* UPLOADING OFFLINE STUDY IMAGES  */
  uploadImages(result){
    let params = {endPoint:'dilos_data/study_image' , key :'photo', file: result[0].photo};
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
    .catch(error => this.handleError(error));
  }


  /* GETTING OFFLINE STUDIES  */
  getOfflineStudies(){

    const data = Observable.fromPromise(this.sql.getAllData(this.TABLE_NAME));

    data.subscribe(result => {
      if(result.length > 0){
        this.getOffline_StudyData(result);      
      }
    },
    error => this.handleError(error));                
  }

  /* GETTING STUDY DATA OF EACH STUDY WE GOT IN THE ABOVE FUNCTION */
  getOffline_StudyData(data){
    const array = [];
    data.forEach((element,index) => {
      const studyData = this.sql.getIDData(this.TABLE_NAME_1,element.id);
      array.push(studyData);
    });

    const getData = Observable.forkJoin(array);
    getData.subscribe(result => {
      this.uploadStudyData(data, result);
    },
    error => this.handleError(error));
  }

  /* UPLOADING ALL STUDIES */
  uploadStudyData(studies, study_data){

    const uploads = [];
    
    studies.forEach((element,index) => {
      let study = element;
      let studydata = study_data[index];
      this.buildStudyData(study,studydata);
      const lastIndex = this.offlineData$.length - 1;
      const upload = this.operations.postRequest('dilos_data/add' , this.offlineData$[lastIndex]);
      uploads.push(upload);
    });

    const upload = Observable.forkJoin(uploads);
    upload.subscribe(result => {
      console.log("ALL STUDY UPLOADS RESULT: " + JSON.stringify(result));
      this.result = result;
      this.clearSQLiteData();
    },
    error => this.handleError(error));

  }


   /* SETTING VALUES OF STUDY TO OBJECT AND PUSHGING IN ARRAY */
   buildStudyData(study, study_data){

    let offlinedataObj = {
      name: null,
      studyStartTime: null,
      studyEndTime: null,
      customerID: null,
      projectID: null,
      locationID: null,
      userID: null,
      addedBy: {
        date: new Date(),
        name: localStorage.getItem("userName"),
        _id: localStorage.getItem("userID")
      },
      role: null,
      area: null,
      data: []
    };

    var element = study;
    offlinedataObj.name = element.title; 
    offlinedataObj.studyStartTime = element.studyStartTime;
    offlinedataObj.studyEndTime = element.studyEndTime;
    offlinedataObj.customerID = element.customerID;
    offlinedataObj.projectID = element.projectID;
    offlinedataObj.userID = element.userID;
    offlinedataObj.locationID = element.locationID;
    offlinedataObj.role = element.role;
    offlinedataObj.area = element.area;
    this.offlineData$.push(offlinedataObj);

    this.buildData(study_data);

  }

  /* BUILDING DATA AND PUSHING  */
  buildData(data) {    
    let lastIndex = this.offlineData$.length - 1;
    data.forEach((element,index) => {
      this.offlineData$[lastIndex].data.push(this.getStudyData(element));
    });
  }

  /* GETTING STUDY DATA FOR ONE OBSERVATION */
  getStudyData(studyData){
    let data = new Data();
    data.setTask(studyData.task);
    data.setElement(studyData.element);
    data.setRating(studyData.rating);
    data.setFrequency(studyData.frequency);
    data.setNotes(studyData.notes);
    data.setPhoto(studyData.photo);
    data.setTime(studyData.time)
    data.setStartTime(studyData.startTime);
    data.setendTime(studyData.endTime);
    data.setduration(studyData.duration);
    return data;
  }
  
  /* CLEARING SQLite DATA */
  clearSQLiteData(){
    this.dropTables().subscribe(
    result => {
      this.isDatSynced = true;
      console.log(this.isDatSynced);
    },
    error => this.handleError(error));
  }

  /* CLEARING DATA BY DROPPING TABLES AFTER SYNCING IS DONE */
  dropTables(){
    const table1 = this.sql.dropTable(this.TABLE_NAME);
    const table2 = this.sql.dropTable(this.TABLE_NAME_1);
    const table3 = this.sql.dropTable(this.TABLE_NAME_2);
    const table4 = this.sql.dropTable(this.TABLE_NAME_3);
    const table5 = this.sql.dropTable(this.TABLE_NAME_4);
    
    const observableArray = [table1, table2, table3, table4, table5];
    return Observable.forkJoin(observableArray);
  }

  /* HANDLING ERROR  */
  handleError(error){
    this.isDatSynced = true;
    if(error.code)
      if([990, 991, 992, 993, 11000 , 'TokenExpiredError'].indexOf(error.code) || !error.auth)
        this.operations.handleError(error);
    else
      return Observable.throw(error.json());
      
  }


}



