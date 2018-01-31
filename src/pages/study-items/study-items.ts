import { Component , ViewChild, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { IonicPage, NavController, NavParams , ModalController} from 'ionic-angular';
import { Time, ParseDataProvider, AlertProvider, ParserProvider, ToastProvider, StudyStatusProvider } from '../../providers';
import { ObservationSummaryPage } from '../observation-summary/observation-summary';
import { SubmitDataProgressPage } from  '../submit-data-progress/submit-data-progress';
import { ALERT_TITLE , REMOVING_STUDY_ITEMS_MSG, ROUND_ENDED, STUDY_ENDED } from '../../config/config'
import { Observable } from 'rxjs';
import * as $ from 'jQuery';
import { SelectRolePage } from '../select-role/select-role';
/**
 * 
 * Generated class for the StudyItemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-study-items',
  templateUrl: 'study-items.html',
})
export class StudyItemsPage implements OnInit {
  
  public round_data: any;
  public study_data: any;
  public isStudyEnded: boolean;
  public temp: any;
  public itemsSelected: any;
  public totalItemsSelected: number;
  public show: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public parseData: ParseDataProvider,
              public modalCtrl: ModalController,
              public time: Time,
              public alert: AlertProvider,
              public parser: ParserProvider,
              public toast: ToastProvider,
              public studyStatus:StudyStatusProvider,
              public location: Location) {
  }


  ngOnInit(){
    this.getData();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    
  }

  /* GETTING DATA */
  getData(){
    this.totalItemsSelected = 0;
    this.itemsSelected = [];
    this.show = this.isStudyEnded = false;
    this.round_data = [];
    this.study_data = this.parser.geAllData();
    this.round_data = this.study_data.rounds[this.study_data.rounds.length - 1];
    this.show = true;
    this.toast.showBottomToast(ROUND_ENDED);
  }
  /* SHOWING SUMMARY OF SINGLE ITEM */
  showSummary(index, sub_index){
    if(index == null)
      index = this.study_data.rounds.length - 1
    this.navCtrl.push(ObservationSummaryPage, {round_index: index, data_index: sub_index});
  }

  /* CONFIRMATION FOR SUBMITTING ALL THE STUDY DATA  */
  openModal(component: string) {

      let data = null;
      if(component == 'EditTitlePage')
        data = { title: this.study_data.title }

      let modal = this.modalCtrl.create(component, data, { cssClass: 'inset-modal items-page-modal' });
      
      modal.onDidDismiss(data => {

        if(component == 'SubmitDataDialogPage'){
          if(data.action == 'submit'){
            this.studyStatus.setStatus(false);
            this.navCtrl.push(SubmitDataProgressPage);
          }
          else{
            console.log('User would like to TRY AGAIN.'); 
            this.isStudyEnded = false;
          }
        }
        else if(component == 'EditTitlePage'){

        }
    
      });
    modal.present();
  }

  /* SHOWING SELECTED ITEMS  */
  showSelectedItems(item) {
    
    const index = this.itemsSelected.indexOf(item);
    if(index > -1){
       this.totalItemsSelected--;
       this.itemsSelected.splice(index, 1);
    }  
    else{
      this.totalItemsSelected++;
      this.itemsSelected.push(item);  
    }
  }

  /* REMOVING ITEM FROM LIST */
  removeItems() { 
   
    let rounds = this.study_data.rounds;
    
    for (let i = rounds.length - 1; i >= 0; i -= 1) {
        
        for(let j= rounds[i].data.length; j>=0; j-=1){
          const index =this.itemsSelected.indexOf(rounds[i].data[j])
          if(index > -1){
            rounds[i].data.splice(index,1);
            this.totalItemsSelected--;
          }
      }

      if(rounds[i].data.length == 0)
        rounds.splice(i,1);
    }
     
    
    this.itemsSelected = [];
  }

  /* START NEXT ROUND */
  startNextRound(){
    this.parseData.clearData();
    this.parseData.clearDataArray();
    this.parser.clearRounds();
    this.time.setTime(this.time.getRoundTime());
    this.parser.getRounds().setRoundStartTime(new Date().getTime());
    this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()- (this.navCtrl.length() - 3)));
  }

  endStudy(){
    this.isStudyEnded = !this.isStudyEnded;
    this.toast.showBottomToast(STUDY_ENDED);
  }

  getListData() {
    alert(JSON.stringify(this.parser.geAllData().getRoundData()));
    this.study_data = [];
    if(!this.isStudyEnded){
      const index = this.parser.geAllData().getRoundData().length - 1;
      this.study_data.push(this.parser.geAllData().getRoundData()[index]);
    }
     else
       this.study_data = this.parser.geAllData().getRoundData();

    return this.study_data;  
  }

  convertTime(time){
    return new Date(time).toLocaleTimeString();
  }

}
