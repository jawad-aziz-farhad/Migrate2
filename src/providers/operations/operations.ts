import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
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
    this.END_POINT = SERVER_URL  + endPoint;
    let headers = this.headers.getHeaders();
    headers.append('Authorization', `${data.token}`);
    return this.http.post(`${this.END_POINT}`, data ,{ headers: headers }).map(res => res.json());
  }

  getLocationsByCustomerID(endPoint, id){
    this.END_POINT = SERVER_URL  + endPoint + `${id}`;
    console.log(this.END_POINT);
    return this.http.get(`${this.END_POINT}` ,{headers: this.headers.getHeaders()}).map(res => res.json()).take(1);
  }

  addData(formData , endPoint){
    let url = SERVER_URL + endPoint;
    return this.http.post(`${url}`, formData).map(res => res.json());
  }

  uploadFile(data: any): Promise<any>{
    
    let filename = data.file.substr(data.file.lastIndexOf('/') + 1);
    
    filename = filename.split("?");
    filename = filename[0];
    let options = {
      fileKey: 'photo',
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/jpeg",
    };
  
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.END_POINT = SERVER_URL + data.endPoint;
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

  // syncData(): Promise<any>{
  //    return new Promise((resolve, reject) => {
  //       this.sql.getAllData('Study_Data').then(result => {
  //         resolve(result);      
  //       }).catch(error => {
  //         console.error('SYNC ERROR: ' + JSON.stringify(error));
  //         reject(error);
  //       });
  //    });
  // }

  // checkForImages(data){

  //    for(let i=0; i<data.length; i++ ) {
  //      if(data[i].photo.indexOf('file:///') > -1) {
  //         let params = {endPoint:'ras_data/study_image' , key :'photo', file: data[i].photo};
  //         this.uploadFile(params).then(response => {
  //             data[i].photo = response.path;
  //             this.parseData.getDataArray()[i].setPhoto(response.path);
  //         }).catch(error => {
  //             console.error('ERROR: ' + JSON.stringify(error));
  //         });
  //      }
  //      else 
  //       console.error('NOT FOUND.');
  //    }
  // }

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
