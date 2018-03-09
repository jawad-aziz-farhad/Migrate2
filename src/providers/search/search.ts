import { Injectable } from '@angular/core';
/*
  Generated class for the SearchProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SearchProvider {

  constructor() {
    console.log('Hello SearchProvider Provider');
  }

  search_Item(data, searchTerm){
    return data.filter((item) => {
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    }); 
  }

}
