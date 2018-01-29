import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the StudyStatusProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StudyStatusProvider {

  private status: boolean;

  constructor(public http: Http) {
    console.log('Hello StudyStatusProvider Provider');
  }

  setStatus(status: boolean){
    this.status = status;
  }

  getStatus(): boolean {
    return this.status;
  }

  

}
