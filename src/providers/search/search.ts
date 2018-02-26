import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DummyData } from '../../models';

/*
  Generated class for the SearchProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SearchProvider {

  constructor(public http: Http) {
    console.log('Hello SearchProvider Provider');
  }

  search_Item(data, searchTerm){
    return data.filter((item) => {
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    }); 
  }

}
