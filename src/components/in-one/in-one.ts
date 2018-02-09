import { Component , Input, Output , EventEmitter, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform , NavParams , MenuController} from 'ionic-angular';
import { TimerComponent } from '../timer/timer';
import { SelectAreaPage } from '../../pages/select-area/select-area';
import { CreateRolePage } from '../../pages/create-role/create-role';
import { Time , ParseDataProvider, SearchProvider, ToastProvider, FormBuilderProvider, TimerService,
         AlertProvider ,LoaderProvider, OperationsProvider, SqlDbProvider, NetworkProvider, StudyStatusProvider } from '../../providers';
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
export class InOneComponent {

  @Input('tablename') TABLE_NAME;
  @Input('tablename1') TABLE_NAME_1;
  @Input('endpoint') endpoint;
  @Input('title') title;

  @Output() next: any = new EventEmitter<any>();

  @ViewChild(TimerComponent) timer: TimerComponent;
  
  private items: Array<any>;
  private searchInput: any;
  private isSearching: boolean;
  private temp: any;
  private show: boolean;
  private isFiltering: boolean;
  private filter: any;
  private _temp: any;
  private sortedItems: any;
  private _project: any;

  @Input('project')
  set project(project: any) {
    // Here you can do what you want with the variable
    this._project = (project && project.trim()) || '';
  }

  get project() { return this._project; }

  constructor(private navCtrl: NavController, 
              private menuCtrl: MenuController,
              private navParams: NavParams,
              private time: Time,
              private operations: OperationsProvider,
              private loader: LoaderProvider,
              private parseData: ParseDataProvider,
              private search: SearchProvider,
              private sql: SqlDbProvider,
              private network: NetworkProvider,
              private toast: ToastProvider,
              private alertProvider: AlertProvider,
              private studyStatus: StudyStatusProvider,
              private formBuilder: FormBuilderProvider,
              private timerService: TimerService) {
    console.log('Hello InOneComponent Component');
    this.initView();
  }

  /*INITIALIZING VIEW */
  initView(){
    this.isFiltering = this.isSearching = this.show = false;        
    this.filter = 'recently_added'; 
    //this.timer.startTimer();
    this.checkDB();       
  }

  /* STARTING TIMER ON GETTING BACK TO THIS VIEW */
  ionViewWillEnter() {
    
  }

  ionViewWillLeave(){
    this.timer.clearTimer();
  }

  /* GETTING DATA */
  gettingData(){
    if(this.network.isInternetAvailable())
      this.dropTable('',this.TABLE_NAME);
    else  
      this.checkDB();   
  }
  
  /* CHECKING LOCAL DATA BASE IF ROLES ARE ALREADY THERE OR NOT */
  checkDB() {
    this.sql.getDatabaseState().subscribe(ready  => {    
        if(ready)
          this.sql.getIDData(this.TABLE_NAME, this.project._id).then(result => {
              if(result.length == 0 || typeof result == 'undefined' || result == null)
                this.getIDs();
              else
                this.populateData(result);
          }).catch(error => {
            console.error('ERROR: ' + JSON.stringify(error));
          });   
    });
  }

  /* GETTING ITEMS IDs FROM Items_IDs TABLE TO GET Items ACCORDINGLY */
  getIDs(){
    this.loader.showLoader(MESSAGE);
    this.items = [];
    this.sql.getIDData(this.TABLE_NAME_1, this.project._id).then(data => {
      console.log('IDS: '+ JSON.stringify(data));
      this.formBuilder.initIDForm(data);
      this.getData();
    }).catch(error => {
        this.loader.hideLoader();
        console.error("ERROR: " + JSON.stringify(error));
    });
  }
  
  /* GETTING DATA FROM SERVER */
  getData() {    
    let formData = this.formBuilder.getIDForm().value;
    this.operations.getByIds(this.endpoint, formData).subscribe(data => {
      console.log("RESULT: \n" +JSON.stringify(data));
      this.createTable(data.result, this.TABLE_NAME);
    },
    error => {
      this.loader.hideLoader();
      console.error('ERROR: ' + JSON.stringify(error.json()));
    });
   }

/* CREATING TABLE TO SAVE TO LOCAL DATA BASE */
createTable(data, table) {
  this.sql.createTable(table).then(res => {
    this.insertData(data);
  });
}

/* INSERTING DATA TO TABLE */
insertData(data) {
  this.sql.addData(this.TABLE_NAME,data).then(result => {
    this.getAllData();
  }).catch(error => {
      console.error("ERROR: " + JSON.stringify(error));
  });
}

/* GETTING ALL DATA OF GIVEN TABLE */
getAllData() {
    this.sql.getAllData(this.TABLE_NAME).then(data => {
      this.loader.hideLoader();
      this.populateData(data);
    }).catch(error => {
        console.error("ERROR: " + JSON.stringify(error));
    })
}

  /* POPULATING DATA */
  populateData(items){
    this.items = [];
    this._temp = {};
    this.sortedItems = [];
    this.sortedItems = items;
    this.items = items;
    this.temp = items;
    this.show = true;
  }

  /* SELECTING ROLE FOR STUDY */
  selectRole(item){
    this._temp = item;
    this._parseData(item);
    setTimeout(() => {
      this.goNext();
    },50);
  }

  /* GOING TO THE NEXT PAGE */
  goNext() {
    this._parseTime();
    this.next.emit(this.project);
    //this.navCtrl.push(SelectAreaPage, { project: this.project});
  }

  getStyle(item){
    if(this._temp._id == item._id)
      return 'list-checked';
    else
      return 'disabled';  
  }

  /* PARSING STUDY TIME */
  _parseTime(){
    this.timer.stopTimer();
    this.timer.pauseTimer()
    this.time.setTime(this.timer.getRemainingTime());
  }

  /* PARSING STUDY DATA */
  _parseData(item: any) {
    if(this.parseData.getData() == null || typeof this.parseData.getData() == 'undefined'){
       let data = new StudyData();
       data.setRole(item);
       this.parseData.setData(data);
    }
    else{
      this.parseData.getData().setRole(item);
    }
  }

  /* DOING SEARCH ON INPUT DATA */
  onSearchInput() {
    if(typeof this.searchInput !== 'undefined' && this.searchInput.length > 3){
      console.log(this.search.search_Item(this.items,this.searchInput, this.endpoint.slice(0,-1)));
      let searchResult = this.search.search_Item(this.items,this.searchInput, this.endpoint.slice(0,-1));
      if(searchResult.length > 0)
        this.items = this.search.search_Item(this.items,this.searchInput, this.endpoint.slice(0,-1));    
    }
    else{
      console.log(JSON.stringify(this.temp));        
      this.items = this.temp;
    }
      
  }

  /* CANCELING SEARCH AND POPULATING ORIGIONAL ITEMS*/  
  onSearchCancel(event) {
    console.log(event.target.value);
    this.items = this.temp;
  }

  /* REFRESHING DATA ON SWIPE DOWN */
  doRefresh(refresher){
    /* IF INTERNET IS NOT AVAILABLE */
    if(!this.network.isInternetAvailable()){
      this.toast.showToast(INTERNET_ERROR);
      refresher.complete();
      return;
    }
    this.sql.isDataAvailable(this.TABLE_NAME).then(result => {
        if(result)
           this.dropTable(refresher, this.TABLE_NAME);
        else
            refresher.complete();
  }).catch(error => {
    refresher.complete();
    console.error('ERROR: ' + JSON.stringify(error));
  })
  }

  /* DROPPING TABLE FROM DATA BASE */
  dropTable(refresher, table){
    this.sql.dropTable(table).then(result => {
      if(refresher != '')
        refresher.complete();
      this.getIDs();
    }).catch(error => {
       refresher.complete();
       console.error('ERROR: ' + JSON.stringify(error));
    });
  }

  /* SORTING ITEMS USING POPULARITY NUMBER  */
  sortRolesbyPopularity() {
    this.sortedItems = [];
    this.sortedItems = this.items;
    for(let i=0; i<this.sortedItems.length; i++) {
        for(let j = ( this.sortedItems.length - 1); j > i ; j--) {
          if(this.sortedItems[i].popularity_number < this.sortedItems[j].popularity_number){
              let temp = this.sortedItems[j];
              this.sortedItems[j] = this.sortedItems[i];
              this.sortedItems[i] = temp;
              console.log('SORTED ARRAY: '+ JSON.stringify(this.sortedItems));
            }
        }
    }
  }
  /* sort DATA BASED ON MOST POPULARITY ATTRIBUTE */
  sortData() {
    if(!this.isFiltering)
       this.temp = this.OriginalArray(this.items);
    else{
      this.items = this.OriginalArray(this.temp);
      this.sortedItems = this.OriginalArray(this.temp);
    }
    this.isFiltering = !this.isFiltering;
    
  }
  /* COPYING ORIGINAL ARRAY */
  OriginalArray(arr) { 
    return arr.slice().sort();
  }

  /* OPENING MENU */
   openMenu(){
    if(this.studyStatus.getStatus())
       this.cancelStudy();
    else
      this.menuCtrl.open();
   }

  /* CANCELLING STUDY */ 
  cancelStudy() {
    this.alertProvider.presentConfirm(ALERT_TITLE , STUDY_CANCELING_MESSAGE).then(action => {
        if(action == 'yes'){
          //this.time.setStatus(true);
          this.timer.killTimer();
          this.studyStatus.setStatus(false);
          this.navCtrl.popToRoot();
        }
        else
          console.log('User dont want to cancel the Study');  
    })
    .catch(error => {
      console.log("ERROR: " + error);
    });
  }

  /* NAVIGATING TO CREATE ROLE PAGE FOR CREATING A NEW ROLE */
  createItem(){
    this._parseTime();
    this.navCtrl.push(CreateRolePage, { project: this.project._id });
  }


}
