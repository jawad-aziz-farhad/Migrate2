import { Component , Input, Output , EventEmitter , OnInit } from '@angular/core';

/**
 * Generated class for the 3InOneComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'in-one',
  templateUrl: 'in-one.html'
})
export class InOneComponent implements OnInit {

  @Input('tablename') TABLE_NAME;
  @Input('items') items: Array<any> = [];
  @Input('isFiltering') isFiltering : boolean = false;

  @Output() next: any = new EventEmitter<any>();
  @Output() is_Filtering = new EventEmitter<boolean>();
  @Output() selectedItem = new EventEmitter<any>();

  private _temp: any = {};
  private filter: any;
  private order: any;
  
  constructor() {
    this._temp = {};
  }

  /* STARTING TIMER ON GETTING BACK TO THIS VIEW */
  ngOnInit() {
    this.filter = 'most_popular';
    if(this.TABLE_NAME == 'Elements')
      this.order  = 'ascending';
    else  
      this.order = null;
  }
  
  is_Filtering_(){
    this.isFiltering = !this.isFiltering;
    this.is_Filtering.emit(this.isFiltering);
  }

  selectItem(item){
    this._temp = item;
    this.selectedItem.emit(item);
  }

  getStyle(item){
    if(this._temp._id == item._id)
      return 'list-checked';
    else
      return 'disabled';  
  }

}
