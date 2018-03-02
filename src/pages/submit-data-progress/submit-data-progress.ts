import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProgressHttp } from "angular-progress-http";
import { FormBuilder, FormGroup, FormArray ,Validators } from '@angular/forms';
import { ParseDataProvider , NetworkProvider, OperationsProvider, HeadersProvider, SqlDbProvider , ToastProvider , FormBuilderProvider , ParserProvider} from '../../providers';
import { SERVER_URL , ERROR, OFFLINE_STUDY_DATA_MSG } from '../../config/config';
import { ProjectsPage } from '../projects/projects';
import { AreasPage } from '../areas/areas';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the SubmitDataProgressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-submit-data-progress',
  templateUrl: 'submit-data-progress.html',
})
export class SubmitDataProgressPage {

  public progress: any;
  public show: boolean;
  public user: any;
  public studyForm: FormGroup;
  private TABLE_NAME: string = 'Study';
  private TABLE_NAME_1: string = 'Study_Data';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: ProgressHttp,
              public storage: Storage,
              public formBuilder: FormBuilder,
              public parseData: ParseDataProvider,
              public viewCtrl: ViewController,
              public network: NetworkProvider,
              public sql: SqlDbProvider,
              public toast: ToastProvider,
              public formProvider: FormBuilderProvider,
              public parser: ParserProvider,
              public headers: HeadersProvider,
              private operations: OperationsProvider) {
    this.initView();           
  }

  ionViewDidLoad() {
  }

  initView(){
    this.show = false;
    this.checkInternetAvailability();
  }

  /* CHECKING INTERNET CONNECTION's INFO */
  checkInternetAvailability(){
    if(this.network.isInternetAvailable())
      this.getUser();
    else
      this.createTable(this.TABLE_NAME);  
  } 

  /* GETTING USER's INFO */
  getUser(){
    this.storage.get('currentUser').then(user => {
      this.user = user;
      this.saveData();
    });
  }

  /* SAVING DATA */
  saveData() {
    this.formProvider.initFormBuilder(this.parser.geAllData(), this.user);
    let formData = this.formProvider.getFormBuilder().value;
    let url = SERVER_URL + 'ras_data/add';
    this.http
        .withUploadProgressListener(progress => { 
          console.log(`Uploading ${progress.percentage}%`); 
          this.progress = progress.percentage;
        })
        .post(`${url}`, formData, {headers: this.headers.getHeaders()})
        .map(res => res.json())
        .subscribe((response) => {
            console.log("RESPONSE: " +JSON.stringify(response));
            if(response.success)
               this.show = true;
            else
              console.error(ERROR);   
        },
        error => {
          let _error = error.json();
          this.operations.handleError(_error);
        });
  }

/* DROPPING TABLES IF EXISTS BEFORE SAVING DATA INTO STUDY AND STUDY_DATA TABLES*/  
dropTable(table){
  this.sql.dropTable(table).then(res => {
      if(table == this.TABLE_NAME)
        this.dropTable(this.TABLE_NAME_1);
      else
        this.createTable(this.TABLE_NAME);  
  }).catch(error => {
      console.log("ERROR: " + JSON.stringify(error));
  });
}  

/* CREATING TABLE TO SAVE TO LOCAL DATA BASE */
createTable(table) {
  this.sql.createTable(table).then(res => {
    if(table == this.TABLE_NAME)
      this.createTable(this.TABLE_NAME_1);
    else
      this.insertStudy();
  });
}

/* INSERTING DATA TO TABLE */
insertStudy() {
  let data = [1];
  this.sql.addData(this.TABLE_NAME,data).then(result => {
    console.log("INSERT STUDY RESPONSE: \n" + JSON.stringify(result));
    if(result)
      this.getStudy();
  }).catch(error => {
    console.error("ERROR: " + JSON.stringify(error));
  });
}
/* GETTING SAVE STUDY */
getStudy(){
  this.sql.getAllData(this.TABLE_NAME).then(result => {
    console.log("STUDY: " +JSON.stringify(result));
    this.insertStudyData(result);
  }).catch(error => {
    console.error("ERROR: " +JSON.stringify(error));
  });
}

/* INSERTING STUDY DATA */
insertStudyData(data) {
  const lastIndex = data.length - 1;
  this.sql.studyData(this.TABLE_NAME_1, data[lastIndex].id).then(result => {
    console.log("INSERT STUDY DATA RESPONSE: \n" +JSON.stringify(result));
    this.getAllData();
}).catch(error => {
    console.error("ERROR: " + JSON.stringify(error));
});
}

getAllData(){
  this.sql.getAllData(this.TABLE_NAME_1).then(result => {
    console.log("STUDY DATA: " +JSON.stringify(result));
    this.show = true;
  }).catch(error => {
    console.error("ERROR: " +JSON.stringify(error));
  });
}

/* GOING TO THE PREVIOUS PAGE BY CLICKING BUTTON  */
go(value: string) {
    this.parseData.clearDataArray();
    this.parseData.clearData();
    const index = this.viewCtrl.index;
    if(value == 'projects')
        this.navCtrl.popToRoot();
    else
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - (this.navCtrl.length() - 1))); 
  }

}
