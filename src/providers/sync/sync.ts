import { Injectable } from '@angular/core';
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

  constructor(public sql: SqlDbProvider, 
              public formBuilder: FormBuilderProvider,
              public operations: OperationsProvider ) {
    console.log('Hello SyncProvider Provider');
  }

  checkOfflineCreatedAER() {

    const table1 = this.sql.getAllData(this.TABLE_NAME_2);
    const table2 = this.sql.getAllData(this.TABLE_NAME_3);
    const table3 = this.sql.getAllData(this.TABLE_NAME_4);

    const observbeAbleArray = [table1, table2,table3];

    const forkJoin = Observable.forkJoin(observbeAbleArray);

    forkJoin.subscribe(result => {
      this.offlineAERData$ = result;
      this.makingAER_Request(result);
    },
    error => {
      console.log('OFFLINE LIKE DATA ERROR: ' + JSON.stringify(error));
    });
  }

  makingAER_Request(data){

    let requests = [];
    
    data.forEach((element, index) => {

        let sub_requests = []; let endPoint = null;
        
        element.forEach((sub_element,sub_index) => {          
            const request = this.formBuilder.initFormForOfflineData(sub_element);
            const data = this.formBuilder.getFormForOfflineData().value;
            if(sub_element.position)
               endPoint = 'roles/add';
            else if(sub_element.type)
              endPoint = 'elements/add';
            else 
              endPoint = 'areas/add';
            
            sub_requests.push(this.operations.offlineRequest(endPoint,data));
        });
        
        requests.push(sub_requests);
    });

    this.savingAERData(requests);
  }

  savingAERData(requests){
    let results = [];
    requests.forEach((element,index) => {
      const forkJoin = Observable.forkJoin(element);
      forkJoin.subscribe(result => {
        results.push(result);
        if(index == (requests.length -1)){
          console.log("OFFLINE SYNC DATA RESULT: " + JSON.stringify(results));
          this.checkResult(results);
        }
      },
      error => this.operations.handleError(error));
    }); 
  }

  checkResult(data){
    let errors = [];
    data.forEach((element,index) => {
      element.forEach((sub_element,sub_index) => {
        let code = sub_element.code;
        if(code){
          if(code == 11000)
            errors.push({index: index, sub_index: sub_index });
          else
            this.operations.handleError(sub_element);
        }
      });
    });

     if(errors.length == 0)
        this.updateStudyData(data);
     else
        this.askForUpdateNames(errors,data);
  }

  askForUpdateNames(errors,data){
      errors.forEach((element,index) => {
        console.log(element.index + '\n' + element.sub_index)
      });
  }

  updateStudyData(data){
    let updates = [];
    let errors = [];
    this.offlineAERData$.forEach((element,index) => {
      element.forEach((sub_element,sub_index) => {
        
          let columns = []; let success = false;
          let queryData = {live: null, offline: null , numericID: null};
          columns[0] = '_id';
          columns[1] = 'numericID';

          success = data[index][sub_index].success;

         
          if(sub_element.type){
            queryData.live = data[index][sub_index].elementID;
            queryData.numericID = data[index][sub_index].numericID;
          }

          else if(sub_element.position)
            queryData.live = data[index][sub_index].roleID;
          
          else 
            queryData.live = data[index][sub_index].areaID;
            
          queryData.offline = this.offlineAERData$[index][sub_index]._id; 

          console.log("Offline Entry at index: "+ sub_index + " IS " + queryData.offline + 
                        "\n ONLINE ENTRY AT INDEX IS: " + queryData.live);  
          
          const update = this.sql.updateTable(this.TABLE_NAME_1, queryData);
          updates.push(update);
        
        
      });
    });

    if(errors.length > 0)
      alert('THERE ARE SOME ELEMENTS WHICH WERE NOT CREATED IN A RIGHT WAY.');

    // const forkJoin = Observable.forkJoin(updates);
    // forkJoin.subscribe(result => {
    //   this.getUpdatedData();
    // },
    // error => {
    //   console.log('UPDATE ERROR: ' + JSON.stringify(error));
    // });
  
  }

  getUpdatedData(){

    const table1 = this.sql.getAllData("Areas");
    const table2 = this.sql.getAllData("Elements");
    const table3 = this.sql.getAllData("Roles");

    const observbeAbleArray = [table1, table2,table3];

    const forkJoin = Observable.forkJoin(observbeAbleArray);

    forkJoin.subscribe(result => {
      console.log('UPDATED DATA: '+ JSON.stringify(result));
    },
    error => {
      console.log('UPDATED DATA ERROR: ' + JSON.stringify(error));
    });
  }

  

}
