import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import { Observable } from "rxjs";
import { SERVER_URL , ENTRY_ALREADY_EXIST , SESSION_EXPIRED, ERROR } from '../../config/config';
import { HeadersProvider } from '../headers/headers';
import { AuthProvider } from '../auth/auth';
import { ToastProvider } from '../toast/toast';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
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

    let URL = SERVER_URL + 'projects/get';
    let headers = this.headers.getHeaders();
    let data = { studyType: 3 };

    return this.http.post(`${URL}`, data ,{ headers: headers }).catch(this.catchError)
                    .flatMap(response => {    
      
      let res = response.json();
      
      return new Observable(observer => {

        if(!res || res.length == 0){
          observer.next([]);
          observer.complete();
        }
        else
          res.forEach((project, index) => {
              
            this.forkJoin(project).subscribe((result: any) => {

                result.forEach((item,_index) => {

                    if(_index == 1 && item.result)
                      item = item.result;
                  
                    if(item && _index >= 1 && item.length > 0){
                      item.forEach((subitem,subindex) => {                        
                        subitem.projectID = project._id;       
                        if(_index == 4 && subindex == 0 && subitem.elements_data && subitem.elements_data.length > 0){
                          subitem.elements_data.forEach((element,sub_index)=> {
                            element.projectID = project._id;
                          });
                        }
                      });
                    }
                });

              res[index].customer = result[0];
              res[index].customer_locations = result[1];
              res[index].areas_data = result[2];
              res[index].roles_data = result[3];
              res[index].tasks_data = result[4];
              /* IF TASKS EXISTS AND ELEMENT'S DATA ALSOE EXISTS */
              if(result[4].length > 0 && result[4][0].elements_data)
                res[index].elements_data = result[4][0].elements_data;
              else
                res[index].elements_data = [];

                if(index == (res.length - 1)) {
                  this.postRequest('categories/get',null).subscribe(result => {
                    res[0].categories = result;
                    this.getElementsCategories(observer, res);
                  },
                  error => this.handleError(error));
                }
              },
              error => console.error("ERROR:" +JSON.stringify(error)));   
          });
      });
    }).catch(this.catchError);
  }

  forkJoin(project) {
    
    let requests = []; let request = null;
    
    request = this.postRequest('customers/getByID',{id: this.checkRequestData(project.customer)});
    requests.push(request);
    
    request = this.postRequest('locations/getByProjectID',{projectID: this.checkRequestData(project._id)});
    requests.push(request);
    
    request = this.postRequest('areas/getByProjectID',{projectID: this.checkRequestData(project._id)});
    requests.push(request);
  
    request = this.postRequest('roles/getByProjectID',{projectID: this.checkRequestData(project._id)});
    requests.push(request);

    request = this.postRequest('tasks/getByProjectID',{projectID: this.checkRequestData(project._id)});
    requests.push(request);
    
    return Observable.forkJoin(requests);
  }

  postRequest(endPoint, data) {

    /* ADDING STUDY TYPE TO FETCH DATA RELATED TO STUDY TYPE */
    if(data)
      data.studyType = 3;
    else
      data = { studyType: 3 };  
    console.log("POST REQUEST DATA IS %0 ", data);
     
    this.END_POINT = SERVER_URL + endPoint;
    let headers = this.headers.getHeaders();
    /* FILTERING ELEMENTS FOR GETTING ONLY THOSE ELEMENTS WHICH HAVE STUDY TYPE ROLE STUDY */
    if(endPoint.indexOf('tasks/getByProjectID') > -1)
      return this.http.post(`${this.END_POINT}`, data ,{ headers: headers })
                              .map(res => res.json())
                              .flatMap((tasks: Array<any>) =>  this.getTaskElements(tasks))
                              .catch(this.catchError);
    
    else
      return this.http.post(`${this.END_POINT}`, data ,{ headers: headers }).map(res => res.json()).catch(this.catchError);
      
  }

  offlineRequest(endPoint,data){
    /* ADDING STUDY TYPE TO FETCH DATA RELATED TO STUDY TYPE */
    data.studyType = 3;
    console.log("DATA IS %0 ", data);

    this.END_POINT = SERVER_URL + endPoint;
    let headers = this.headers.getHeaders();
    return this.http.post(`${this.END_POINT}`, data ,{ headers: headers }).map(res => res.json()).catch(this.catch_Error);
  }

  /* GETTING ELEMENTS RELATED TO EACH TASK */
  getTaskElements(tasks): Observable<any> {

    return new Observable(observer => {
    
      if(tasks.length == 0) {
        observer.next([]);
        observer.complete();
      }

      else {
        let requests = [];
        tasks.forEach((task,index) => {
          if(task.elements.length > 0){
            let ids = [];
            task.elements.forEach((element,index) => {
              ids.push(element._id);
            });
            let request = this.postRequest('elements/getByIDs', {ids: ids});
            requests.push(request);
          }
        });
      
       let fork_Join =  Observable.forkJoin(requests);
       let elements_data = [];
       fork_Join.subscribe(result => {
          result.forEach((result: any,index) => {
            result.forEach((item,sub_index) => {
              item.taskID = tasks[index]._id;
              elements_data.push(item);
;            });
            tasks[index].elements = result;
          });

          tasks[0].elements_data = elements_data;
          observer.next(tasks);
          observer.complete();
       });
      }
    });
  }

  /* GETTING CATEGORIES OF ALL ELEMENTS TO AND MANIPULATING type KEY WITH studyType */
  getElementsCategories(observer, data){    
    let requests = [];
    data.forEach((element,index) => {
      if(element && element.elements_data && element.elements_data.length > 0) {
        element.elements_data.forEach((sub_element,sub_index) => {
          let request = this.postRequest('categories/getByID', {id: sub_element.category});
          requests.push(request);
        });
      }
    });
    
    if(requests.length == 0){
      observer.next(data);
      observer.complete();
    }
    else {
        Observable.forkJoin(requests).subscribe((result: any) => {

          data.forEach((element,index) => {
            if(element && element.elements_data && element.elements_data.length > 0) {
              element.elements_data.forEach((sub_element,sub_index) => {
              sub_element.category = result[sub_index]._id; 
              sub_element.studyType = result[sub_index].studyType;
              sub_element.type = result[sub_index].type;
            });
          }
        });
        

          observer.next(data);
          observer.complete();
        },
        error => console.error("ERROR: " + JSON.stringify(error)));
    }
  }

  /* CATCHING ERROR */
  catch_Error(error: Response) {
    let error$  = error.json();
    if(error$.code == 11000)
      return Observable.of(error$);
    else  
      return Observable.throw(error.json() || 'Server Error');
  }

  /* CHECKING DATA */
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
    
    let options = {
      fileKey: 'photo',
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers:  { Authorization: localStorage.getItem("TOKEN") }
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
    let data = { endPoint:'dilos_data/study_image' , key :'photo', file: photo};
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
