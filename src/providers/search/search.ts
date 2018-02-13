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

  searchItem(searchTerm, from){
    let data = new DummyData();
    /* SEARCHING AREA */
    if(from == 'area'){
      console.log('SEARCHING IN AREA: ' + searchTerm);
      return data.getAreas().filter((item) => {
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });    
    }
    /* SEARCHING ROLE */
    else if(from == 'role'){
      console.log('SEARCHING IN ROLE');
      return data.getRoles().filter((item) => {
        return item.rolename.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });    
    }
    /* SEARCHING ELEMENT */
    else if(from == 'element'){
      console.log('SEARCHING IN ELEMENT');
      return data.getElements().filter((item) => {
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });    
    }

  }

  search_Item(data, searchTerm , searchFor){
    alert(searchFor)
    return data.filter((item) => {
      if(searchFor == 'area')
        return item.areaname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      else if(searchFor == 'element')
        return item.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      else if(searchFor == 'role')
        return item.rolename.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;  
     
    }); 
  }

}
