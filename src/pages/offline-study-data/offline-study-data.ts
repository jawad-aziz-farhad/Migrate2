import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NetworkProvider , SqlDbProvider , OperationsProvider , LoaderProvider , FormBuilderProvider, ToastProvider, ParserProvider, Sync } from "../../providers/index";
import { Storage } from "@ionic/storage";
import { StudyData, AllStudyData,  } from '../../models';
import { SYNC_DONE , MESSAGE , SYNC_DATA_MSG, ERROR, INTERNET_ERROR } from '../../config/config';
import { ObservationSummaryPage } from '../observation-summary/observation-summary';
import { Observable } from 'rxjs';
import * as $ from 'jQuery';
/**
 * Generated class for the OfflineStudyDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offline-study-data',
  templateUrl: 'offline-study-data.html',
})
export class OfflineStudyDataPage {

  private items: Array<any> = [];
  private TABLE_NAME: string = 'Study';
  private TABLE_NAME_1: string = 'Study_Data';
  public show: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public sql: SqlDbProvider,
              public parser: ParserProvider,
              public loader: LoaderProvider,
              private toast: ToastProvider,
              public network: NetworkProvider,
              private storage: Storage,
              public operations: OperationsProvider,
              public sync: Sync) {
    this.initView();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfflineStudyDataPage');
  }

  initView(){
    this.show = false;  
    this.items = [];        
    this.getOfflineData(this.TABLE_NAME_1); 
  }

  
  /* GETTING OFFLINE DATA AND SYNCING IT TO THE SERVER */
  getOfflineData(table){
    this.loader.showLoader(MESSAGE);
    this.sql.getAllData(table).then(result => {
      this.loader.hideLoader();
          
      if(result && result.length > 0)
        this.items = result; 
        this.show = true;
    }).catch(error => {
      this.loader.hideLoader();
    });
  }

  getNames(){
    this.items.forEach((element, index) => {
      this.sql.getIDData('Elements',element.getElement()).then(result => {
          
          element.element = result[0].name;
          element.numericID  = result[0].numericID;
      }).catch(error => {
        console.error("ERROR IN GETTING DETAILS: " + JSON.stringify(error));
      });
    });

    this.show = true;
  }


  /* DROPPING SQL TABLE AFTER SYNCING DATA */
  dropTable(){
    this.sql.dropTable(this.TABLE_NAME_1).then(res => {
     
    }).catch(error => {
      console.error('ERROR: '+ JSON.stringify(error));
    })
  }

    /* SHOWING SUMMARY OF SINGLE ITEM */
    showSummary(item){
      this.navCtrl.push(ObservationSummaryPage, {item: item});
    }

    updateOfflineData(){
      this.sync.checkingOfflineData('Create_Area');
    }



}
