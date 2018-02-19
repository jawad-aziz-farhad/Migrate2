
import { ViewChild } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { ToastProvider, LoaderProvider, FormBuilderProvider, SearchProvider, AlertProvider, ParseDataProvider,
        OperationsProvider, SqlDbProvider, NetworkProvider, StudyStatusProvider, Time} from '../providers';
import { ERROR , MESSAGE, INTERNET_ERROR, ALERT_TITLE, STUDY_CANCELING_MESSAGE } from '../config/config';
import { TimerComponent } from '../components/timer/timer';
import { DummyData , StudyData} from '../models';
import { CreateAreaPage } from '../pages/create-area/create-area';
import { CreateElementPage } from '../pages/create-element/create-element';
import { CreateRolePage } from '../pages/create-role/create-role';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';


export class Data {
  
  protected timer: TimerComponent;

  protected TABLE_NAME: string = '';
  protected TABLE_NAME_1: string = '';
  protected project: any;
  protected temp: any;
  protected _temp: any;
  protected isFiltering: boolean;
  protected show: boolean;
  protected data: Array<any>;
  protected nextComponent: any;

  constructor(public navCtrl: NavController,
              public time: Time ,
              public parseData: ParseDataProvider,
              public search: SearchProvider,
              public loader: LoaderProvider,
              public operations: OperationsProvider,
              public sql: SqlDbProvider,
              public network: NetworkProvider,
              public studyStatus: StudyStatusProvider,
              public alert: AlertProvider,
              public formBuilder: FormBuilderProvider,
              public menuCtrl: MenuController,
              public toast: ToastProvider){
  }

  init(TABLE_NAME: string, TABLE_NAME_1: string, project: any, nextComponent: any){
      this.show = false;
      this.nextComponent = nextComponent;
      this.TABLE_NAME = TABLE_NAME;
      this.TABLE_NAME_1 = TABLE_NAME_1;
      this.project = project;
      this.pullSQLData();
  }

  /* PULLING SQLite DATA */
  pullSQLData(){

    const data = Observable.fromPromise(this.sql.getIDData(this.TABLE_NAME,this.project._id));

    data.subscribe((result: any) => {
        if(result.length > 0)
          this.populateData(result);
        else
          this.pullServerData();  
    },
    error => console.error(error));    
  }           
 
  /* PULLING DATA FROM SERVER */
  pullServerData(){
    this.loader.showLoader(MESSAGE);
    const source = Observable.fromPromise(this.sql.getIDData(this.TABLE_NAME_1, this.project._id));
    //map to inner observable and flatten
    const data = source.flatMap(result => {
      this.formBuilder.initIDForm(result);
      let formData = this.formBuilder.getIDForm().value;
      return this.operations.get_data(this.TABLE_NAME.toLowerCase()+ '/getByIds', formData)
    });

    data.subscribe(data => {
      if(data.lenght == 0){
        this.loader.hideLoader();
        return;
      }
      data.result.forEach((element,index) => {
        element.projectID = this.project._id;  
      });
      
      this.saveData(data)
    },
    error => this.handleError(error));    
  }

  /* SAVING DATA LOCALLY */
  saveData(data){

    const save = this.sql.addData(this.TABLE_NAME, data);
    const get = this.sql.getAllData(this.TABLE_NAME);
    
    const concat = Observable.concat(save, get);
    concat.subscribe(result => {
      if(result.length > 0)
        this.populateData(result);
    },
    error => console.error('ERROR: ' + JSON.stringify(error)),
    () => this.loader.hideLoader()
    );
  }


 /* POPULATING DATA */
  populateData(data){
    this.data = [];
    this._temp = {};
    this.data = data;
    this.temp = data;
    this.show = true;
  }

  /* SELECTED ELEMENT FOR STUDY */
  selectItem(item){
    this._temp = item;
    this._parseData(item);
  }

  /* PARSING ROUND TIME TO NEXT PAGE */
  _parseTime(){
    this.timer.stopTimer();
    this.timer.pauseTimer()
    this.time.setTime(this.timer.getRemainingTime());
  }
  /* PARSING STUDY DATA */
  _parseData(item: any){
     let study_data = null;
     if(this.parseData.getData() == null || typeof this.parseData.getData() == 'undefined')
        study_data = new StudyData();
     else
        study_data = this.parseData.getData();   
     
    if(this.TABLE_NAME == 'Areas')
      study_data.setArea(item);
    else if(this.TABLE_NAME == 'Elements')
      study_data.setElement(item);
    else if(this.TABLE_NAME == 'Roles')
      study_data.setRole(item);
    
    this.parseData.setData(study_data);
    this.goNext();
  }


  goNext() {
    this.time.setTime(this.timer.getRemainingTime())
    this.navCtrl.push(this.nextComponent, { project: this.project});
  }

  getStyle(item){
    if(this._temp._id == item._id)
      return 'list-checked';
    else
      return 'disabled';  
  }

  handleError(error){
    this.loader.hideLoader();
    console.error('ERROR: ' + error);
  }


 onSearchInput(searchInput): any{
    if(typeof searchInput !== 'undefined' && searchInput.length > 3){
      let searchResult = this.search.search_Item(this.data, searchInput , this.TABLE_NAME.toLowerCase());
      if(searchResult.length > 0)
      this.data = this.search.search_Item(this.data, searchInput , this.TABLE_NAME.toLowerCase().slice(0,-1));
    }
         
    else{
      console.log(JSON.stringify(this.temp));        
      this.data = this.temp;
    }

     return this.data; 
      
  }

  onSearchCancel(data) : any {
    this.data = data;
    return this.data;
  }

  /* REFRESHING DATA ON SWIPE DOWN */
  doRefresh(refresher) {
    /* IF INTERNET IS NOT AVAILABLE */
    if(!this.network.isInternetAvailable()){
      this.toast.showToast(INTERNET_ERROR);
      refresher.complete();
      return;
    }
    
    this.dropTable(refresher);
    
  }

  /* DROPPING TABLE FROM DATA BASE */
  dropTable(refresher){
    this.sql.dropTable(this.TABLE_NAME).then(result => {
      if(refresher !== '')
        refresher.complete();
      this.pullServerData();
    }).catch(error => {
       refresher.complete();
       console.error('ERROR: ' + JSON.stringify(error));
    });
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
    this.alert.presentConfirm(ALERT_TITLE , STUDY_CANCELING_MESSAGE).then(action => {
        if(action == 'yes'){
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
  createItem(event){
    let component = null;
    if(this.TABLE_NAME == 'Areas')
      component = CreateAreaPage;
    else if(this.TABLE_NAME == 'Elements')
      component = CreateElementPage
    else if(this.TABLE_NAME == 'Roles')
      component = CreateRolePage;
    
    this.navCtrl.push(component, {project: this.project});
  }

  is_Filtering(){
    this.isFiltering = !this.isFiltering;
  }
    
}