
import { ViewChild } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { ToastProvider, LoaderProvider, FormBuilderProvider, SearchProvider, AlertProvider,
        OperationsProvider, SqlDbProvider, NetworkProvider, StudyStatusProvider, Time} from '../providers';
import { ERROR , MESSAGE, INTERNET_ERROR, ALERT_TITLE, STUDY_CANCELING_MESSAGE } from '../config/config';
import { TimerComponent } from '../components/timer/timer';
import { DummyData } from '../models';
import { CreateAreaPage } from '../pages/create-area/create-area';

export class Data {
  
  protected timer: TimerComponent;

  protected TABLE_NAME: string = '';
  protected TABLE_NAME_1: string = '';
  protected project: any;
  protected temp: any;
  protected isFiltering: boolean;
  
  private data: Array<any>;
  private sortedData: Array<any>;


  constructor(protected navCtrl: NavController,
              protected menuCtrl: MenuController,
              protected sql: SqlDbProvider, 
              protected loader: LoaderProvider,
              protected formBuilder: FormBuilderProvider,
              protected search: SearchProvider,
              protected operations: OperationsProvider,
              protected network: NetworkProvider,
              protected studyStatus: StudyStatusProvider,
              protected toast: ToastProvider,
              protected alert: AlertProvider,
              protected time: Time
             ){}

  init(TABLE_NAME: string, TABLE_NAME_1: string, project: any){
      this.TABLE_NAME = TABLE_NAME;
      this.TABLE_NAME_1 = TABLE_NAME_1;
      this.project = project;
      //alert(this.TABLE_NAME + '\n' + this.TABLE_NAME_1 + '\n' +JSON.stringify(this.project));
      this.checkDB();
  }           
  /* CHECKING LOCAL DATA BASE IF ELEMENTS ARE ALREADY THERE OR NOT */
  checkDB(){
    this.sql.getDatabaseState().subscribe(ready  => {    
      if(ready)
        this.sql.getIDData(this.TABLE_NAME, this.project._id).then(result => {
            if(result.length == 0 || typeof result == 'undefined' || result == null)
              this.getIDs();
            else{
             this.temp = result;
             this.data = result;
           }
        }).catch(error => {
          console.error('ERROR: ' + JSON.stringify(error));
        });   
    });
    
  }

  /* GETTING ROLES IDs FROM Areas_IDs TABLE TO GET ROLES ACCORDINGLY */
  getIDs(){
    this.loader.showLoader(MESSAGE);
    this.data = [];
    this.sql.getIDData(this.TABLE_NAME_1, this.project._id).then(data => {
      this.formBuilder.initIDForm(data);
      setTimeout(() => {
        this.getData();
      },300);
      
    }).catch(error => {
        this.loader.hideLoader();
        console.error("ERROR: " + JSON.stringify(error));
    });
  }

  /* GETTING DATA FROM SERVER */
  getData() {
      let formData = this.formBuilder.getIDForm().value;
      this.operations.getByIds(this.TABLE_NAME.toLowerCase(), formData).subscribe(data => {
        console.log("RESULT: \n" +JSON.stringify(data));
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

/* GETTING ALL DATA OF GIVEN TABLE */
getAllData() {
  this.sql.getAllData(this.TABLE_NAME).then(data => {
    this.loader.hideLoader();
    this.data = [];
    this.data = data;
  }).catch(error => {
      console.error("ERROR: " + JSON.stringify(error));
  });
}

  /*POPULATING DATA */
  get_Data(){
    return this.data;
 }

  goNext(component) {
    this.navCtrl.push(component, { project: this.project});
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
    this.sortedData = [];
    this.sortedData = this.data;
    for(let i=0; i<this.sortedData.length; i++) {
        for(let j = ( this.sortedData.length - 1); j > i ; j--) {
          if(this.sortedData[i].popularity_number < this.sortedData[j].popularity_number){
              let temp = this.sortedData[j];
              this.sortedData[j] = this.sortedData[i];
              this.sortedData[i] = temp;
              console.log('SORTED ARRAY: '+ JSON.stringify(this.sortedData));
            }

        }
    }
  }

  /* sort DATA BASED ON MOST POPULARITY ATTRIBUTE */
  sortData() {
    if(!this.isFiltering)
       this.temp = this.OriginalArray(this.data);
    else{
      this.data = this.OriginalArray(this.temp);
      this.sortedData = this.OriginalArray(this.temp);
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
    this.navCtrl.push(CreateAreaPage, {project: this.project});
  }



    
}