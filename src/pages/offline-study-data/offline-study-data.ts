import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NetworkProvider , SqlDbProvider  , LoaderProvider ,  ToastProvider, Sync } from "../../providers/index";
import { SYNC_DONE , MESSAGE , SYNC_DATA_MSG, ERROR, INTERNET_ERROR } from '../../config/config';
import { ObservationSummaryPage } from '../observation-summary/observation-summary';
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
              public loader: LoaderProvider,
              private toast: ToastProvider,
              public network: NetworkProvider,
              public loading: LoadingController,
              public sync: Sync) {
    this.initView();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfflineStudyDataPage');
  }

  initView(){
    this.show = false;  
    this.items = [];        
    this.getOfflineData(); 
  }
  
  /* GETTING OFFLINE DATA AND SYNCING IT TO THE SERVER */
  getOfflineData(){
    this.sql.getAllData(this.TABLE_NAME).then(result => {
      if(result && result.length > 0){
        this.items = result;
        this.getNames();
      }
      else   
        this.show = true;
      
    }).catch(error => {
    });
  }

  /* GETTING ELEMENT NAME AND NUMERIC ID  */
  getNames(){
    this.items.forEach((element, index) => {
      this.sql.getIDData('OfflineData', element.element).then(result => {
        if(result.length > 0){
          element.element = result[0].name;
          element.numericID  = result[0].numericID;
        }
      }).catch(error => {
        console.error("ERROR IN GETTING DETAILS: " + JSON.stringify(error));
      });
    });

    this.show = true;
  }

  /* SHOWING SUMMARY OF SINGLE ITEM */
  showSummary(item){
    this.navCtrl.push(ObservationSummaryPage, {item: item});
  }

  updateOfflineData(){
   this.loader.showLoader(MESSAGE);
   this.sync.syncOfflinedata().subscribe((result: any) => {
      console.log("SYNCING DONE: "+ JSON.stringify(result));
      this.getOfflineData();
   },
   error => console.error("SYNCING ERROR: "+ JSON.stringify(error)),
   () => this.loader.hideLoader());

  }

}
