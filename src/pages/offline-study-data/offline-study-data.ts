import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  NetworkProvider , SqlDbProvider , OperationsProvider , LoaderProvider , FormBuilderProvider, ToastProvider} from "../../providers/index";
import { StudyData, AllStudyData,  } from '../../models';
import { SYNC_DONE , MESSAGE , SYNC_DATA_MSG, ERROR } from '../../config/config';
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

  private items: Array<StudyData> = [];
  private TABLE_NAME: string = 'Study_Data';
  public data: any;
  public show: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public sql: SqlDbProvider,
              public operations: OperationsProvider) {
     this.initView(); 
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad OfflineStudyDataPage');
  }

  initView(){
    this.show = false;  
    this.items = [];        
    this.checkOfflineData(); 
  }

  /* CHECKING OFFLINE STUDY DATA WHEN INTERNET CONNECTION IS AVAILABLE */ 
  checkOfflineData() {
    this.sql.isDataAvailable(this.TABLE_NAME).then(result => {
       if(result)
         this.getSQLiteData();        
       else{
          console.log('NO DATA AVAILABLE.');
          this.show = true;
       }
     }).catch(error => {
       console.log('ERROR: ' + JSON.stringify(error));
       return false;
     })
 }

  /* SYNCING OFFLINE DATA  WHEN INTERNET CONNECTION IS AVAILABLE */
  getSQLiteData(){
    
    this.items = [];

    this.operations.syncData().then(result => {
      for(let i=0; i< result.length;i++){
        
        let all_data = new AllStudyData();
        all_data.setTitle(result[i].title);
        all_data.setStudyStartTime(result[i].studyStartTime);
        all_data.setStudyEndTime(result[i].studyEndTime);
        
        let data = new StudyData();
        data.setArea(result[i].area);
        data.setElement(result[i].element);
        data.setRole(result[i].role);
        data.setRating(result[i].rating);
        data.setFrequency(result[i].frequency);
        data.setNotes(result[i].notes);
        data.setObservationTime(result[i].observationTime);  
        data.setPhoto(result[i].photo);

        this.items.push(data);
      }
      this.show = true;
    }).catch(error => {
      console.error('ERROR: '+ JSON.stringify(error));
    });
  }

  /* SHOWING SUMMARY OF SINGLE ITEM */
  showSummary(item){
    this.navCtrl.push(ObservationSummaryPage, {item: item});
  }


}
