import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/mergeMap';
import { Observable } from "rxjs";
import { forkJoin } from "rxjs/observable/forkJoin";

import { SERVER_URL } from '../../config/config';
import { HeadersProvider } from '../headers/headers';
import { AuthProvider } from '../auth/auth';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { SqlDbProvider } from '../sql-db/sql-db';
import { ParseDataProvider } from '../parse-data/parse-data';

/*
  Generated class for the OperationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OperationsProvider {
  
  private END_POINT: any;
  constructor(public http: Http ,
              private transfer: FileTransfer,
              private auth: AuthProvider,
              public headers: HeadersProvider,
              public sql: SqlDbProvider,
              public parseData: ParseDataProvider) {
    console.log('Hello OperationsProvider Provider');
  }

  get(endPoint): Observable<any>{
    this.END_POINT = SERVER_URL + endPoint + '/get';
    console.log(this.END_POINT);
    return this.http.get(this.END_POINT, {headers: this.headers.getHeaders()}).map(res => res.json());
  }

  get_data(endPoint, data){
    this.END_POINT = SERVER_URL + endPoint;
    let headers = this.headers.getHeaders();
    return this.http.post(`${this.END_POINT}`, data ,{ headers: headers }).map(res => res.json());
  }

  getdata(){
    let res = []; let requests = [];
    let URL = SERVER_URL + 'projects/get';
    let headers = this.headers.getHeaders();
    return this.http.post(`${URL}`, null ,{ headers: headers }).flatMap(response => {      
      let res = response.json();
      return new Observable(observer => {
          res.forEach((project, index) => {
            this.forkJoin(project).subscribe((result: any) => {
                result.forEach((item,_index) => {
                    if(_index >= 2 && item.result.length > 0){
                        item.result.forEach((subitem,subindex) => {
                          subitem.projectID = project._id;
                        });
                      }
                });
                res[index].customer = result[0];
                res[index].customer_locations = result[1];
                res[index].areas_data = result[2].result;
                res[index].elements_data = result[3].result;
                res[index].roles_data = result[4].result;

                if(index == (res.length - 1)){
                  this.singleRequest('categories/get',null).subscribe(result => {
                      res[0].categories = result;
                      observer.next(res);
                  },
                  error => console.error(error));
                  
                }
            },
            error => console.error("ERROR:" +JSON.stringify(error)));   
          });
        });
    });
  }

  forkJoin(project){
       let requests = []; let request = null; let data = null;
       
       request = this.singleRequest('customers/getByID',{id: this.checkRequestData(project.customer)});
       requests.push(request);
       
       request = this.singleRequest('locations/getByCustomerId',{customerID: this.checkRequestData(project.customer)});
       requests.push(request);
       
       request = this.singleRequest('areas/getByIds',{ids: this.checkRequestData(project.areas)});
       requests.push(request);
      
       request = this.singleRequest('elements/getByIds',{ids: this.checkRequestData(project.elements)});
       requests.push(request);

       request = this.singleRequest('roles/getByIds',{ids: this.checkRequestData(project.roles)});
       requests.push(request);
      
       return Observable.forkJoin(requests);
  }

  checkRequestData(data){
    let request_data = null;
    if(data.length > 0)
       request_data = data
    else
       request_data = [];
     return request_data;  
  }

  singleRequest(endPoint,data): Observable<any> {
    let URL = SERVER_URL + endPoint;
    return this.http.post(`${URL}`, data , {headers: this.headers.getHeaders()}).map(res => res.json());
  }


  getLocationsByCustomerID(endPoint, id){
    this.END_POINT = SERVER_URL  + endPoint + `${id}`;
    console.log(this.END_POINT);
    return this.http.get(`${this.END_POINT}` ,{headers: this.headers.getHeaders()}).map(res => res.json()).take(1);
  }

  addData(formData , endPoint){
    let url = SERVER_URL + endPoint;
    return this.http.post(`${url}`, formData,{headers: this.headers.getHeaders()}).map(res => res.json());
  }

  uploadFile(data: any): Promise<any>{
    
    let filename = data.file.substr(data.file.lastIndexOf('/') + 1);
    
    filename = filename.split("?");
    filename = filename[0];
    let headers = this.headers.getHeaders();
    
    let options = {
      fileKey: 'photo',
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers:  { Authorization: localStorage.getItem("TOKEN") }
    };
  
    const fileTransfer: FileTransferObject = this.transfer.create();
    //this.END_POINT = SERVER_URL + data.endPoint;
    
    this.END_POINT = 'http://retime-dev.herokuapp.com/' + data.endPoint;
    // Using the FileTransfer to upload the image and returning Promise
    return new Promise((resolve, reject) => {

          fileTransfer.upload(data.file,  `${this.END_POINT}` , options).then(data => {
            fileTransfer.abort();
            resolve(data.response);
          },
            err => {
              fileTransfer.abort();
              reject(err);
          });

    });
  }

  _uploadFile(photo): Observable<any> {
    let data = {endPoint:'ras_data/study_image' , key :'photo', file: photo};
    let filename = data.file.substr(data.file.lastIndexOf('/') + 1);
    
    filename = filename.split("?");
    filename = filename[0];
    let options = {
      fileKey: 'photo',
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {Autorization: localStorage.getItem('TOKEN')}
    };
  
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.END_POINT = SERVER_URL + data.endPoint;
    // Using the FileTransfer to upload the image and returning Promise
     
     return new Observable(observer => {
      fileTransfer.upload(data.file,  `${this.END_POINT}` , options).then(data => {
        fileTransfer.abort();
        observer.next(data);
        observer.complete();
      },
        err => {
          fileTransfer.abort();
          observer.next(err);
          observer.complete();          
      });  
     });
  }

  uploadPhoto(photo: any): Promise<any>{  
   return new Promise((resolve, reject) => {
      let params = {endPoint:'ras_data/study_image' , key :'photo', file: photo};
      this.uploadFile(params).then(res => {
        let response = JSON.parse(res);
        resolve(response);
      }).catch(error => {
          reject(error);
      });
    });
  }

}
