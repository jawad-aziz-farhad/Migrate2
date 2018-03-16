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
      if(result && result.length > 0){
        this.getStudyData(result);
      }
      else   
        this.show = true;
      
    }).catch(error => {
    });
  }

  /* GETTING ALL THE STUDY DATA */
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
          this.makingSQLiteRequests();
      });
    });
  }

  /* MAKING SQLite REQUESTS TO GET NAMES AGAINST EACH ID */
  makingSQLiteRequests(){

    let items = [];
    let areas = [];
    let elements = [];
    let roles = [];

    this.items.forEach((element, index) => {
      const _element = this.sql.getIDData('OfflineElement', element.element);
      elements.push(_element)
      const area = this.sql.getIDData('OfflineArea', element.area);
      areas.push(area);
      const role = this.sql.getIDData('OfflineRole', element.role);
      roles.push(role);
    });

    items[0] = areas.slice();
    items[1] = elements.slice();
    items[2] = roles.slice();

    this.gettingData(items, 'areas');
  }

  /* AFTER MAKING SQLite REQUEST, GETTING DATA AND MANIPULATING THE IDs WITH NAMES */
  gettingData(data, table){

    let items = [];
    if(table == 'areas')
      items = data[0];
    else if(table == 'elements')
    items = data[1];
    else if(table == 'roles')
    items = data[2];  

    const request = Observable.forkJoin(items);

    request.subscribe((result: any) => {
      result.forEach((element, index) => {
        if(element.length > 0){
          if(table == 'areas')
            this.items[index].area = element[0].name;
          else if(table == 'elements')
            this.items[index].element = element[0].name;
          else
            this.items[index].role = element[0].name;
          
        }

        if(index == (result.length - 1)){
          if(table == 'roles')
            this.show = true;
          else{
            if(table == 'areas')
              table = 'elements';
            else if(table == 'elements')
              table = 'roles';
            this.gettingData(data,table) ; 
          }
        }
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
