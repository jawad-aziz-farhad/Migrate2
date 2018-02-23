import { Component , ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform , NavParams , MenuController} from 'ionic-angular';
import { SelectAreaPage } from '../select-area/select-area';
import { CreateRolePage } from '../create-role/create-role';
import { Time , ParseDataProvider, SearchProvider, ToastProvider, FormBuilderProvider,
         AlertProvider ,LoaderProvider, OperationsProvider, SqlDbProvider, NetworkProvider } from '../../providers';
import { ERROR , MESSAGE, INTERNET_ERROR , STUDY_START_TOAST, ALERT_TITLE, STUDY_CANCELING_MESSAGE, NO_DATA_FOUND } from '../../config/config';
import { Role, DummyData , StudyData } from '../../models';
import { FormBuilder } from '@angular/forms/src/form_builder';
import { Data } from '../../bases/data';
/**
 * Generated class for the SelectRolePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-role',
  templateUrl: 'select-role.html',
})
export class SelectRolePage {
  
//   constructor(navCtrl: NavController,  
//               protected navParams: NavParams,
//               time: Time ,
//               parseData: ParseDataProvider,
//               search: SearchProvider,
//               loader: LoaderProvider,
//               operations: OperationsProvider,
//               sql: SqlDbProvider,
//               network: NetworkProvider,
//               alert: AlertProvider,
//               formBuilder: FormBuilderProvider,
//               menuCtrl: MenuController,
//               toast: ToastProvider) {
//     super(navCtrl,time,parseData,search,loader,operations,sql,network,alert, formBuilder,menuCtrl,toast);
//   }

//   ionViewDidLoad() {
//     console.log('ionViewDidLoad SelectAerPage');
//   }

//   ionViewWillEnter(){
//     this.init('Roles','Roles_IDs',this.navParams.get('project'), SelectAreaPage);
//  }
  
  public roles: Array<Role>;
  public searchInput: any;
  public isSearching: boolean;
  public temp: any;
  public show: boolean;
  public isFiltering: boolean;
  public filter: any;
  public _temp: any;
  public sortedRoles: any;
  public project: any;

  private TABLE_NAME: string = 'Roles';
  private TABLE_NAME_1: string = 'Roles_IDs';

  constructor(public navCtrl: NavController, 
              public menuCtrl: MenuController,
              public navParams: NavParams,
              public time: Time,
              public operations: OperationsProvider,
              public loader: LoaderProvider,
              public parseData: ParseDataProvider,
              public search: SearchProvider,
              public sql: SqlDbProvider,
              public network: NetworkProvider,
              public toast: ToastProvider,
              public alertProvider: AlertProvider,
              public formBuilder: FormBuilderProvider,
              public platform: Platform) {
  }

  /*INITIALIZING VIEW */
  initView(){
    this.isFiltering = this.isSearching = this.show = false;        
    this.project  = this.navParams.get('project');
    this.filter = 'recently_added'; 
    //this.timer.startTimer();
    this.checkDB();       
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectRolePage: ');
  }

  /* STARTING TIMER ON GETTING BACK TO THIS VIEW */
  ionViewWillEnter() {
    this.initView();
  }

  ionViewWillLeave(){
  }
  /* CHECKING LOCAL DATA BASE IF ROLES ARE ALREADY THERE OR NOT */
  checkDB() {
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

  /* GETTING ROLES IDs FROM Roles_IDs TABLE TO GET ROLES ACCORDINGLY */
  getIDs(){
    this.loader.showLoader(MESSAGE);
    this.roles = [];
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
    this.operations.postRequest('roles/getByIds', formData).subscribe(data => {
      if(data.result.length == 0){
          this.toast.showBottomToast(NO_DATA_FOUND);
          this.loader.hideLoader();
          return;
      }
      data.result.forEach((element, index) => {
        element.projectID = this.project._id;
      });
      this.createTable(data.result, this.TABLE_NAME);
    },
    error => {
      this.loader.hideLoader();
      this.operations.handleError(error);
    });
   }

/* CREATING TABLE TO SAVE TO LOCAL DATA BASE */
createTable(data, table) {
  this.sql.createTable(table).then(res => {
    this.insertData(data);
  }).catch(error => {
    this.loader.hideLoader();
  });
}

/* INSERTING DATA TO TABLE */
insertData(data) {
  this.sql.addData(this.TABLE_NAME,data).then(result => {
    this.loader.hideLoader();
    this.getAllData();
  }).catch(error => {
    this.loader.hideLoader();
    console.error("ERROR: " + JSON.stringify(error));
  });
}


  /* POPULATING DATA */
  populateData(roles){
    this.roles = [];
    this._temp = {};
    this.sortedRoles = [];
    this.sortedRoles = roles;
    this.roles = roles;
    this.temp = roles;
    this.show = true;
  }

  /* SELECTING ROLE FOR STUDY */
  selectRole(role){
    this._temp = role;
    this._parseData(role);
    setTimeout(() => {
      this.goNext();
    },50);
  }

  /* GOING TO THE NEXT PAGE */
  goNext() {
    this.navCtrl.push(SelectAreaPage, { project: this.project});
  }

  getStyle(role){
    if(this._temp._id == role._id)
      return 'list-checked';
    else
      return 'disabled';  
  }

  /* PARSING STUDY DATA */
  _parseData(role: any) {
    if(this.parseData.getData() == null || typeof this.parseData.getData() == 'undefined'){
       let data = new StudyData();
       data.setRole(role);
       data.setObservationTime(new Date().getTime());
       this.parseData.setData(data);
    }
    else{
      this.parseData.getData().setRole(role);
      this.parseData.getData().setObservationTime(new Date().getTime());
    }
  }

  /* DOING SEARCH ON INPUT DATA */
  onSearchInput() {
    if(typeof this.searchInput !== 'undefined' && this.searchInput.length > 3){
      console.log(this.search.search_Item(this.roles,this.searchInput, 'role'));
      let searchResult = this.search.search_Item(this.roles,this.searchInput, 'role');
      if(searchResult.length > 0)
        this.roles = this.search.search_Item(this.roles,this.searchInput, 'role');    
    }
    else {
      console.log(JSON.stringify(this.temp));        
      this.roles = this.temp;
    } 
  }

  /* CANCELING SEARCH AND POPULATING ORIGIONAL ROLES*/  
  onSearchCancel(event) {
    console.log(event.target.value);
    this.roles = this.temp;
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

  /* SORTING ROLES USING POPULARITY NUMBER  */
  sortRolesbyPopularity() {
    this.sortedRoles = [];
    this.sortedRoles = this.roles;
    for(let i=0; i<this.sortedRoles.length; i++) {
        for(let j = ( this.sortedRoles.length - 1); j > i ; j--) {
          if(this.sortedRoles[i].popularity < this.sortedRoles[j].popularity){
              let temp = this.sortedRoles[j];
              this.sortedRoles[j] = this.sortedRoles[i];
              this.sortedRoles[i] = temp;
              console.log('SORTED ARRAY: '+ JSON.stringify(this.sortedRoles));
            }
        }
    }
  }
  /* sort DATA BASED ON MOST POPULARITY ATTRIBUTE */
  sortData() {
    if(!this.isFiltering)
       this.temp = this.OriginalArray(this.roles);
    else{
      this.roles = this.OriginalArray(this.temp);
      this.sortedRoles = this.OriginalArray(this.temp);
    }
    this.isFiltering = !this.isFiltering;
  }
  /* COPYING ORIGINAL ARRAY */
  OriginalArray(arr) { 
    return arr.slice().sort();
  }

  /* OPENING MENU */
   openMenu(){
    if(this.time.isTimerRunning)
       this.cancelStudy();
    else
      this.menuCtrl.open();
   }

  /* CANCELLING STUDY */ 
  cancelStudy() {
    this.alertProvider.presentConfirm(ALERT_TITLE , STUDY_CANCELING_MESSAGE).then(action => {
        if(action == 'yes'){
          // this.time.destroyTimer();
          // this.studyStatus.setStatus(false);
          console.log('Stopping Study.');
          this.time.destroyTimer()
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
  createRole(){
    this.navCtrl.push(CreateRolePage, { project: this.project });
  }


}
