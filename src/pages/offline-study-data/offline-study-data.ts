import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NetworkProvider , SqlDbProvider  , LoaderProvider ,  ToastProvider, Sync } from "../../providers/index";
import { SYNC_DONE , MESSAGE } from '../../config/config';
import { ObservationSummaryPage } from '../observation-summary/observation-summary';
import { Observable } from 'rxjs';

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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfflineStudyDataPage');
  }

  ionViewWillEnter(){
    this.initView();
  }

  initView(){
    this.show = false;  
    this.items = [];        
    this.getStudies(); 
  }
  
  /* GETTING OFFLINE DATA AND SYNCING IT TO THE SERVER */
  getStudies(){
    this.sql.getAllData(this.TABLE_NAME).then(result => {
      console.log("STUDIES: "+JSON.stringify(result));
      if(result && result.length > 0){
        this.getStudyData(result);
      }
      else   
        this.show = true;
      
    }).catch(error => {
    });
  }

  getStudyData(data){
    let studies = [];
    data.forEach((element,index) => {
      let study = this.sql.getIDData(this.TABLE_NAME_1, element.id);
      studies.push(study);
    });

    const fetch = Observable.forkJoin(studies);
    fetch.subscribe((result: any) => {
    
      result.forEach((element, index) => {
          if(element.length > 0){
            element.forEach((sub_element, sub_index) => {
              sub_element.studyStartTime = data[index].studyStartTime;
              sub_element.title = data[index].title;
              this.items.push(sub_element);
            });
          }
          if(index == (result.length - 1))
            this.getElements();
        });
    });
  }

  /* GETTING ELEMENT NAME AND NUMERIC ID  */
  getElements(){
    let elements = [];

    this.items.forEach((element, index) => {
      const data = this.sql.getIDData('OfflineElement', element.element);
      elements.push(data)
    });

    const request = Observable.forkJoin(elements);

    request.subscribe((result: any) => {
      result.forEach((element, index) => {
        if(element.length > 0){
          this.items[index].element = element[0].name;
        }
        if(index == (result.length - 1))
          this.getAreas();
      });
  });

  }

  getAreas(){

    let elements = [];

    this.items.forEach((element, index) => {
      const data = this.sql.getIDData('OfflineArea', element.area);
      elements.push(data)
    });

    const request = Observable.forkJoin(elements);

    request.subscribe((result: any) => {
      result.forEach((element, index) => {
        if(element.length > 0){
          this.items[index].area = element[0].name;
        }
        if(index == (result.length - 1))
          this.show = true;
      });
    });
    
  }

  /* SHOWING SUMMARY OF SINGLE ITEM */
  showSummary(item){
    this.navCtrl.push(ObservationSummaryPage, {item: item});
  }

  updateOfflineData(){
   this.loader.showLoader(MESSAGE);
   this.sync.syncOfflinedata().subscribe((result: any) => {
      if(result[0].success){
        this.toast.showBottomToast(SYNC_DONE);
        this.items = [];
      }
   },
   error => console.error("SYNCING ERROR: "+ JSON.stringify(error)),
   () => this.loader.hideLoader());
  }


}
