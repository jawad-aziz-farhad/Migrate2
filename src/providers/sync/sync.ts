import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { SqlDbProvider , FormBuilderProvider , OperationsProvider } from '../index';
import { SERVER_URL } from '../../config/config';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

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
  private table: string = null;

  constructor(public modalCtrl: ModalController,
              public sql: SqlDbProvider, 
              public formBuilder: FormBuilderProvider,
              public operations: OperationsProvider ) {
    console.log('Hello SyncProvider Provider');
  }

  /* CHECKING OFFLINE DATA  */
  checkingOfflineData(table){

    this.table = table;
    const data = this.sql.getAllData(table);
    
    data.then(result => {

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
      this.getOfflineData();
  }

  askForUpdateNames(errors,index,result){

    let lastIndex = this.offlineAERData$.length - 1;
    let data = this.offlineAERData$[lastIndex][index];
    
    this.updateName(data).subscribe(result => {
    
      lastIndex = this.onlineAERData$.length - 1;
      this.onlineAERData$[lastIndex][index] = result;
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

  getOfflineData(){

    const data = Observable.fromPromise(this.sql.getAllData("Study_Data"));

    data.subscribe(result => {
      console.log("Study Data RESULT: "+ JSON.stringify(result));
      this.updateStudyData();
    },
    error => console.error("ERROR: " + JSON.stringify(error)));
  }

  updateStudyData(){
    const updates = [];
    this.offlineAERData$.forEach((element,index) => {
      element.forEach((sub_element,sub_index) => {
        let data = {live: null, offline: null , numericID: null, };
        let column = null; let table = null;
        data.offline = sub_element._id;
        data.live = this.onlineAERData$[index][sub_index]._id;
        data.numericID = this.onlineAERData$[index][sub_index].numericID;
        table = this.getTable(sub_element);
        column = table.toLowerCase().slice(0, -1);
        let update = this.sql.updateTable(table ,null,data);
        updates.push(update);
        update = this.sql.updateTable("Study_Data",column,data);
        updates.push(update);
      });
    });

    const update = Observable.forkJoin(updates);
    update.subscribe(result => {
      console.log("UPDATED TABLES RESULT: "+ JSON.stringify(result));
    },
    error => console.error("UPDATE ERROR: "+ JSON.stringify(error)));
  }

  getTable(data){
    let table = null;
    if(data.position)
      table = 'Roles';
    else if(data.type)
       table = 'Elements';
    else
      table = 'Areas';
    return table;  
  }

  getUpdatedData(){

    const table1 = this.sql.getAllData("Areas");
    const table2 = this.sql.getAllData("Elements");
    const table3 = this.sql.getAllData("Roles");
    const table4 = this.sql.getAllData("Study_Data");

    const observbeAbleArray = [table1, table2, table3, table4];

    const forkJoin = Observable.forkJoin(observbeAbleArray);

    forkJoin.subscribe(result => {
      console.log('UPDATED DATA: '+ JSON.stringify(result));
    },
    error => {
      console.log('UPDATED DATA ERROR: ' + JSON.stringify(error));
    });
  }


}
