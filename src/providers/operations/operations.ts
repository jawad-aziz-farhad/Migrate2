import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import { Observable } from "rxjs";
import { forkJoin } from "rxjs/observable/forkJoin";
import { SERVER_URL , ENTRY_ALREADY_EXIST , SESSION_EXPIRED, ERROR } from '../../config/config';
import { HeadersProvider } from '../headers/headers';
import { AuthProvider } from '../auth/auth';
import { ToastProvider } from '../toast/toast';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
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
              public toast: ToastProvider) {
    console.log('Hello OperationsProvider Provider');
  }
  
  getdata(){
    let res = []; let requests = [];
    let URL = SERVER_URL + 'projects/get';
    let headers = this.headers.getHeaders();
    return this.http.post(`${URL}`, null ,{ headers: headers }).catch(this.catchError)
                    .flatMap(response => {      
      let res = response.json();
      return new Observable(observer => {
          res.forEach((project, index) => {
            this.forkJoin(project).subscribe((result: any) => {
                result.forEach((item,_index) => {
                    if(_index >= 1 && item.result.length > 0){
                        item.result.forEach((subitem,subindex) => {
                          subitem.projectID = project._id;
                        });
                      }
                });
                res[index].customer = result[0];
                res[index].customer_locations = result[1].result;
                res[index].areas_data = result[2].result;
                res[index].elements_data = result[3].result;
                res[index].roles_data = result[4].result;

                if(index == (res.length - 1)){
                  this.postRequest('categories/get',null).subscribe(result => {
                      res[0].categories = result;
                      observer.next(res);
                  },
                  error => this.handleError(error));
                }
            },
            error => console.error("ERROR:" +JSON.stringify(error)));   
          });
        });
    });
  }

  forkJoin(project){
       let requests = []; let request = null; let data = null;
       
       request = this.postRequest('customers/getByID',{id: this.checkRequestData(project.customer)});
       requests.push(request);
       
       request = this.postRequest('locations/getByIds',{ids: this.checkRequestData(project.locations)});
       requests.push(request);
       
       request = this.postRequest('areas/getByIds',{ids: this.checkRequestData(project.areas)});
       requests.push(request);
      
       request = this.postRequest('elements/getByIds',{ids: this.checkRequestData(project.elements)});
       requests.push(request);

       request = this.postRequest('roles/getByIds',{ids: this.checkRequestData(project.roles)});
       requests.push(request);
      
       return Observable.forkJoin(requests);
  }

  postRequest(endPoint, data){
    this.END_POINT = SERVER_URL + endPoint;
    let headers = this.headers.getHeaders();
    return this.http.post(`${this.END_POINT}`, data ,{ headers: headers }).map(res => res.json()).catch(this.catchError);
  }

  offlineRequest(endPoint,data){
    this.END_POINT = SERVER_URL + endPoint;
    let headers = this.headers.getHeaders();
    return this.http.post(`${this.END_POINT}`, data ,{ headers: headers }).map(res => res.json()).catch(this.catch_Error);

  }

  /* CATCHING ERROR */
  catch_Error(error: Response) {
    let error$  = error.json();
    if(error$.code == 11000)
      return Observable.of(error$);
    else  
      return Observable.throw(error.json() || 'Server Error');
  }

  checkRequestData(data){
    let request_data = null;
    if(data.length > 0)
       request_data = data
    else
       request_data = [];
     return request_data;  
  }

  /* CATCHING ERROR */
  catchError(error: Response) {
    return Observable.throw(error.json() || 'Server Error');
  }

  /* HANDLING ERROR SENT BY THE SERVER */
  handleError(error){
    if(error.code == 11000)
        this.toast.showBottomToast(ENTRY_ALREADY_EXIST);
    else if([990, 991, 992, 993, 'TokenExpiredError'].indexOf(error.code) !== -1 || !error.auth){
      if(error.msg)
        this.toast.showBottomToast(error.msg);
      else
        this.toast.showBottomToast(SESSION_EXPIRED);
      this.auth.logOut();
    }
    else 
      this.toast.showToast(ERROR);
    
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
    let data = { endPoint:'ras_data/study_image' , key :'photo', file: photo};
    console.log(JSON.stringify(data));
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


}
