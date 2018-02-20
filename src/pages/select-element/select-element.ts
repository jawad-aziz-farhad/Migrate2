import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { TimerComponent } from '../../components/timer/timer';
import { NewTimerComponent } from '../../components/new-timer/new-timer';
import { RatingsPage } from '../ratings/ratings';
import { AddFrequencyPage } from '../add-frequency/add-frequency';
import { CreateElementPage } from '../create-element/create-element';
import { Time , ParseDataProvider, SearchProvider, ToastProvider, LoaderProvider, FormBuilderProvider,
         OperationsProvider, SqlDbProvider, NetworkProvider, StudyStatusProvider , AlertProvider } from '../../providers';
import { ERROR , MESSAGE, INTERNET_ERROR, ALERT_TITLE, STUDY_CANCELING_MESSAGE, NO_DATA_FOUND } from '../../config/config';
import { StudyData } from '../../models';
import { Element , DummyData} from '../../models';
import { Observable } from "rxjs";
import { Data } from '../../bases/data';
/**
 * Generated class for the SelectElementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-select-element',
  templateUrl: 'select-element.html',
})
export class SelectElementPage {
  
//   constructor(navCtrl: NavController,  
//               protected navParams: NavParams,
//               time: Time ,
//               parseData: ParseDataProvider,
//               search: SearchProvider,
//               loader: LoaderProvider,
//               operations: OperationsProvider,
//               sql: SqlDbProvider,
//               network: NetworkProvider,
//               studyStatus: StudyStatusProvider,
//               alert: AlertProvider,
//               formBuilder: FormBuilderProvider,
//               menuCtrl: MenuController,
//               toast: ToastProvider) {
//     super(navCtrl,time,parseData,search,loader,operations,sql,network,studyStatus,alert, formBuilder,menuCtrl,toast);
//   }

//   ionViewDidLoad() {
//     console.log('ionViewDidLoad SelectAerPage');
//   }

//   ionViewWillEnter(){
//     this.init('Elements','Elements_IDs',this.navParams.get('project'), RatingsPage);
//  }

  @ViewChild(TimerComponent) timer: TimerComponent;
 
  public roundTime: number = 0;
  public elements: any;
  public isClicked: boolean;
  public temp: any;
  public _temp: any;
  public show: boolean;
  public searchInput: any;
  public isSearching: boolean;
  public isFiltering: boolean;
  public filter: any;
  public order: any;
  private sortedElements: any;
  public project: any;

  private TABLE_NAME: string = 'Elements';
  private TABLE_NAME_1: string = 'Elements_IDs';

  constructor(public navCtrl: NavController, 
              public menuCtrl: MenuController,
              public navParams: NavParams , 
              public time: Time,
              public operations: OperationsProvider,
              public loader: LoaderProvider,
              public parseData: ParseDataProvider,
              public search: SearchProvider ,
              public sql: SqlDbProvider,
              public network: NetworkProvider,
              public toast: ToastProvider,
              public studyStatus: StudyStatusProvider,
              public formBuilder: FormBuilderProvider,
              public alertProvider: AlertProvider) {

        
  }

  initView() {
    this.isSearching = false;
    this.sortedElements = [];
    this.isClicked = this.isFiltering = this.show = false;    
    this.project  = this.navParams.get('project');    
    this.filter = 'recently_added'; 
    this.order = 'ascending';
    this.timer.resumeTimer();
    this.checkDB();
  }
  
  ionViewDidLoad() {    
    console.log('ionViewDidLoad SelectElementPage');    
  }

  ionViewWillEnter() {
    this.initView(); 
  }


  /* CHECKING LOCAL DATA BASE IF ELEMENTS ARE ALREADY THERE OR NOT */
  checkDB(){
    this.sql.getDatabaseState().subscribe(ready  => {    
      if(ready)
        this.getAllData();   
    });
  }

  /* GETTING ALL DATA OF GIVEN TABLE */
  getAllData() {
    this.sql.getIDData(this.TABLE_NAME, this.project._id).then(result => {
        if(result.length == 0 || typeof result == 'undefined' || result == null)
          this.getIDs();
        else
          this.populateData(result);
    }).catch(error => {
      console.error('ERROR: ' + JSON.stringify(error));
      if(error.code == 5)
          this.getIDs();
    });   
  }

  /* GETTING ROLES IDs FROM Elements_IDs TABLE TO GET ROLES ACCORDINGLY */
  getIDs(){
    this.loader.showLoader(MESSAGE);
    this.elements = [];
    this.sql.getIDData(this.TABLE_NAME_1, this.project._id).then(data => {
      if(data.length > 0){
        this.formBuilder.initIDForm(data);
        this.getData();
      }
      else{
        this.toast.showBottomToast(NO_DATA_FOUND);
        this.loader.hideLoader();
      }
    }).catch(error => {
      this.loader.hideLoader();
      console.error("ERROR: " + JSON.stringify(error));
    });
  }

  /* GETTING DATA FROM SERVER */
  getData() {
      let formData = this.formBuilder.getIDForm().value;
      this.operations.get_data('elements/getByIds', formData).subscribe(data => {
        console.log("RESULT: \n" +JSON.stringify(data));
        if(data.result.length == 0){
          this.toast.showBottomToast(NO_DATA_FOUND);
          this.loader.hideLoader();
          return;
        }
        data.result.forEach((element, index) => {
            element.projectID = this.project._id;
        });
        this.createTable(data.result);
      },
      error => {
          this.loader.hideLoader();
        console.error('ERROR: ' + JSON.stringify(error.json()));
      });
  }

/* CREATING TABLE TO SAVE TO LOCAL DATA BASE */
createTable(data) {
  this.sql.createTable(this.TABLE_NAME).then(res => {
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


/* POPULATING DATA */
populateData(elements){
  this.elements = [];
  this.sortedElements = [];
  this._temp = {};
  this.elements = elements;
  this.sortedElements = elements;
  this.temp  = elements;
}

/* START TIMER WHEN THE VIEW IS LOADED 1st TIME */
isLoaded1stTime(){
  this.timer.startTimer();
  this.show = true;
}
/* GOING TO THE NEXT VIEW */
goNext() {
  this._parseTime();
  if(this._temp.rating == null){
    this._temp.rating = 100;
    this.navCtrl.push(RatingsPage, {element: this._temp});
  }
  else if(this._temp.rating.toLowerCase().trim() == "field user input")
    this.navCtrl.push(RatingsPage, {element: this._temp});
  else{
    /* SETTING RATING VALUE AND SKIPPING RATINGS PAGE */
    this.parseData.getData().setRating(this._temp.rating);
    this.parseData.setData(this.parseData.getData());
    this.navCtrl.push(AddFrequencyPage)
  }
}
  
  /* SELECTED ELEMENT FOR STUDY */
  selectElement(element){
    this._temp = element;
    this._parseData(element);
    setTimeout(() => {
      this.goNext();
    },50);
  }

  /* PARSING ROUND TIME TO NEXT PAGE */
  _parseTime(){
    this.timer.stopTimer();
    this.timer.pauseTimer()
    this.time.setTime(this.timer.getRemainingTime());
  }
  /* PARSING STUDY DATA */
  _parseData(element: any){
    this.parseData.getData().setElement(element);
    this.parseData.setData(this.parseData.getData());
    console.log("STUDY DATA AT ELEMENT PAGE: \n" + JSON.stringify(this.parseData.getData()));
  }

  getStyle(element){
    if(this._temp._id == element._id)
      return 'list-checked';
    else
      return 'disabled';  
  }

  onSearchInput(){
    if(typeof this.searchInput !== 'undefined' && this.searchInput.length > 3){
      let searchResult = this.search.search_Item(this.elements,this.searchInput, 'element');
      if(searchResult.length > 0)
        this.elements = this.search.search_Item(this.temp,this.searchInput, 'element');;  
    }
    else{
      console.log(JSON.stringify(this.temp));        
      this.elements = this.temp;
    }
  }
  
  /* CANCELING SEARCH BY CLICK CROSS ICON */
  onSearchCancel(event) {
    console.log(event.target.value);
    this.elements = this.temp;
  }

  /* REFRESHING DATA ON SWIPE DOWN */
  doRefresh(refresher) {
     /* IF INTERNET IS NOT AVAILABLE */
     if(!this.network.isInternetAvailable()){
      this.toast.showToast(INTERNET_ERROR);
      refresher.complete();
      return;
    }

    this.sql.isDataAvailable(this.TABLE_NAME).then(result => {
        if(result)
           this.dropTable(refresher);
        else
            refresher.complete();
  }).catch(error => {
    refresher.complete();
    console.error('ERROR: ' + JSON.stringify(error));
  })
  }

  /* DROPPING TABLE FROM DATA BASE */
  dropTable(refresher){
    this.sql.dropTable(this.TABLE_NAME).then(result => {
      if(refresher != '')
         refresher.complete();
      this.getIDs();
    }).catch(error => {
       refresher.complete();
       console.error('ERROR: ' + JSON.stringify(error));
    });
  }

  /* sort DATA BASED ON MOST POPULARITY ATTRIBUTE */
  sortData() {
    if(!this.isFiltering)
       this.temp = this.OriginalArray(this.elements);
    else{
      this.elements = this.OriginalArray(this.temp);
      this.sortedElements = this.OriginalArray(this.temp);
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

  /* NAVIGATING TO CREATE ELEMENT PAGE FOR CREATING A NEW ELEMENT */
  createElement(){
    this._parseTime();
    this.navCtrl.push(CreateElementPage, {project: this.project});
  }

}
