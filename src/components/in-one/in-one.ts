import { Component , Input, Output , EventEmitter, ViewChild , OnInit , OnDestroy } from '@angular/core';
import { IonicPage, NavController, Platform , NavParams , MenuController} from 'ionic-angular';
import { SelectAreaPage } from '../../pages/select-area/select-area';
import { CreateAreaPage } from '../../pages/create-area/create-area';
import { CreateElementPage } from '../../pages/create-element/create-element';
import { CreateRolePage } from '../../pages/create-role/create-role';
import { Time , ParseDataProvider, SearchProvider, ToastProvider, FormBuilderProvider,
         AlertProvider ,LoaderProvider, OperationsProvider, SqlDbProvider, NetworkProvider } from '../../providers';
import { ERROR , MESSAGE, INTERNET_ERROR , STUDY_START_TOAST, ALERT_TITLE, STUDY_CANCELING_MESSAGE } from '../../config/config';
import { Role, DummyData , StudyData } from '../../models';
import { Observable } from "rxjs";
import { FormBuilder } from '@angular/forms/src/form_builder';

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
  @Output() create = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();

  private _temp: any = {};
  private filter: any;
  private order: any;
  
  constructor(private time: Time) {
    this._temp = {};
  }

  /* STARTING TIMER ON GETTING BACK TO THIS VIEW */
  ngOnInit() {
    this.filter = 'most_popular';
    this.order  = 'ascending';
  }

  ngOnDestroy(){
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

  doRefresh(refresher){
    this.refresh.emit(refresher);
  }

  createItem(){
   this.create.emit('create');    
  }
}
