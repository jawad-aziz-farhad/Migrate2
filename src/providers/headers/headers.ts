import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the HeadersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HeadersProvider {

  constructor() {
    console.log('Hello HeadersProvider Provider');
  }

  getHeaders(): Headers {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('charset', 'utf-8');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE , OPTIONS');
    headers.append('Access-Control-Allow-Headers', 'Content-Type, ');
    return headers;
  }

  getFileHeaders(){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE , OPTIONS');
    return headers;
  }

}
