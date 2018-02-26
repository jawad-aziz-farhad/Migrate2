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

  constructor(public sql: SqlDbProvider, 
              public formBuilder: FormBuilderProvider,
              public operations: OperationsProvider ) {
    console.log('Hello SyncProvider Provider');
  }

  checkOfflineCreatedAER(){
    const table1 = this.sql.getAllData(this.TABLE_NAME_2);
    const table2 = this.sql.getAllData(this.TABLE_NAME_3);
    const table3 = this.sql.getAllData(this.TABLE_NAME_4);

    const observbeAbleArray = [table1, table2,table3];

    const forkJoin = Observable.forkJoin(observbeAbleArray);

    forkJoin.subscribe(result => {
      console.log('OFFLINE LIKE DATA: '+ JSON.stringify(result));
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
            
              sub_requests.push(this.operations.postRequest(endPoint,data));
            
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
        if(index == (requests.length -1))
          console.log("OFFLINE SYNC DATA RESULT: " + JSON.stringify(results));
      },
      error => {
        console.log('ERROR: ' + JSON.stringify(error));
      });
    }); 
  }
  

}
