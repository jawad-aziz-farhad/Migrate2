import { Component , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { TimerComponent } from '../../components/timer/timer';
import { NewTimerComponent } from '../../components/new-timer/new-timer';
import { SelectElementPage } from '../select-element/select-element';
import { Time , ParseDataProvider, SearchProvider, ToastProvider, LoaderProvider, FormBuilderProvider, TimerService,
        OperationsProvider, SqlDbProvider, NetworkProvider, StudyStatusProvider , AlertProvider} from '../../providers';
import { ERROR , MESSAGE, INTERNET_ERROR, ALERT_TITLE, STUDY_CANCELING_MESSAGE, NO_DATA_FOUND } from '../../config/config';
import { DummyData } from '../../models';
import { CreateAreaPage } from '../create-area/create-area';
import { Data } from '../../bases/data';
/**
 * Generated class for the SelectAreaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-area',
  templateUrl: 'select-area.html',
})
 export class SelectAreaPage {
  
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
//     this.init('Areas','Areas_IDs',this.navParams.get('project'), SelectElementPage);
//  }

  @ViewChild(TimerComponent) timer: TimerComponent;

  public roundTime: number = 0;
  public areas: any;
  public sortedAreas: any;
  public searchInput: any;
  public isSearching: boolean;
  public temp: any;
  public show: boolean;
  public isFiltering: boolean;
  public filter: any; 
  public _temp: any;

  protected project: any;
  protected TABLE_NAME: string = 'Areas';
  protected TABLE_NAME_1: string = 'Areas_IDs';
  private _data: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams , 
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
              public toast: ToastProvider,
              public timerService: TimerService) {             
     
  }

  initView(){
    this.show = false;        
    this.isFiltering = false;   
    this.isSearching = false;
    this.filter = 'recently_added';  
    this.temp = [];
    this.sortedAreas = [];
    this.areas = [];
    this.project = this.navParams.get('project');
    this.checkDB(); 
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectAreaPage: ' + this.roundTime);
  }

  ionViewWillEnter() {
    this.timer.resumeTimer();
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

  /* GETTING ROLES IDs FROM Areas_IDs TABLE TO GET ROLES ACCORDINGLY */
  getIDs(){
    this.loader.showLoader(MESSAGE);
    this.areas = [];
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
      this.operations.get_data('areas/getByIds', formData).subscribe(data => {
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
  populateData(areas){
    this.areas = [];
    this._temp = {};
    this.areas = areas;
    this.sortedAreas = areas;
    this.temp  = areas;
  }

  selectArea(area){
    this._temp = area;
    this._parseData(area);
    setTimeout(() => {
      this.goNext();
    },50);
  }

  goNext() {
    this._parseTime();
    this.navCtrl.push(SelectElementPage, { project: this.project});
  }

  /* PARSING ROUND TIME TO NEXT PAGE */
  _parseTime(){
    this.timer.stopTimer();
    this.timer.pauseTimer()
    this.time.setTime(this.timer.getRemainingTime());
  }
  
  _parseData(area: any) {
    this.parseData.getData().setArea(area);
    this.parseData.setData(this.parseData.getData());
    console.log("STUDY DATA AT AREA PAGE: " + JSON.stringify(this.parseData.getData()));
  }

  getStyle(area){
    if(this._temp._id == area._id)
      return 'list-checked';
    else
      return 'disabled';  
  }

  onSearchInput(){
    if(typeof this.searchInput !== 'undefined' && this.searchInput.length > 3){
      let searchResult = this.search.search_Item(this.areas,this.searchInput, 'areas');
      if(searchResult.length > 0)
      this.areas = this.search.search_Item(this.areas,this.searchInput, 'area'); 
    }
         
    else{
      console.log(JSON.stringify(this.temp));        
      this.areas = this.temp;
    }
  }

  onSearchCancel(event) {
    console.log(event.target.value);
    this.areas = this.temp;
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
  });
  }

  /* DROPPING TABLE FROM DATA BASE */
  dropTable(refresher){
    this.sql.dropTable(this.TABLE_NAME).then(result => {
      if(refresher !== '')
        refresher.complete();
      this.getIDs();
    }).catch(error => {
       refresher.complete();
       console.error('ERROR: ' + JSON.stringify(error));
    });
  }
  /* SORTING AREAS USING POPULARITY NUMBER  */
  sortAreasbyPopularity() {
    this.sortedAreas = [];
    this.sortedAreas = this.areas;
    for(let i=0; i<this.sortedAreas.length; i++) {
        for(let j = ( this.sortedAreas.length - 1); j > i ; j--) {
          if(this.sortedAreas[i].popularity < this.sortedAreas[j].popularity){
              let temp = this.sortedAreas[j];
              this.sortedAreas[j] = this.sortedAreas[i];
              this.sortedAreas[i] = temp;
              console.log('SORTED ARRAY: '+ JSON.stringify(this.sortedAreas));
            }

        }
    }
  }

  /* sort DATA BASED ON MOST POPULARITY ATTRIBUTE */
  sortData() {
    if(!this.isFiltering)
       this.temp = this.OriginalArray(this.areas);
    else{
      this.areas = this.OriginalArray(this.temp);
      this.sortedAreas = this.OriginalArray(this.temp);
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
    this.alert.presentConfirm(ALERT_TITLE , STUDY_CANCELING_MESSAGE).then(action => {
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
  createArea(){
    this._parseTime();
    this.navCtrl.push(CreateAreaPage, {project: this.project});
  }


}
