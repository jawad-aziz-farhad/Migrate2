import { Component , ViewChild, OnInit, NgZone } from '@angular/core';
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
  
  public items: any;
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
              public location: Location,
              public zone: NgZone) {
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
    this.items = [];
    this.items = this.parser.geAllData();  
    this.show = true;
    this.toast.showBottomToast(ROUND_ENDED);
  }
  /* SHOWING SUMMARY OF SINGLE ITEM */
  showSummary(item){
    this.navCtrl.push(ObservationSummaryPage, {item: item});
  }

  /* CONFIRMATION FOR SUBMITTING ALL THE STUDY DATA  */
  openModal(component: string) {

      var data = null;

      if(component == 'EditTitlePage')
        data = { title: this.items.title }

      let modal = this.modalCtrl.create(component, data, { cssClass: 'inset-modal' });
      
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
  showSelectedItems(i) {
    var _index = this.itemsSelected.indexOf(i);
    if(_index > -1){
       this.totalItemsSelected--;
       this.itemsSelected.splice(_index, 1);
    }  
    else{
      this.totalItemsSelected++;
      this.itemsSelected.push(i);  
    }
    console.log(JSON.stringify(this.itemsSelected));
  }

  /* CHECKING THE SELECTED ITEMS, IF ALL THE STUDY ITEMS ARE SELECTED,
   * THEN AFTER REMOVING ITEMS, 
   * NAVIGATING USER TO PROJECTS PAGE 
  */
  checkSelectedItems(){
    if(this.parseData.getDataArray().length == this.itemsSelected.length) {
        this.alert.presentConfirm(ALERT_TITLE , REMOVING_STUDY_ITEMS_MSG).then(value => {
          if(value == 'yes')
            this.removeItems();
          else
            console.log('ACTION CANCELED');
        });
    }

    else
      this.removeItems();

  }

  /* REMOVING ITEM FROM LIST */
  removeItems() { 
    
    this.removeItem().then(res => {
      if(this.parseData.getDataArray().length == 0){
        this.parseData.clearData();
        this.parseData.clearDataArray();
        this.navCtrl.popToRoot();
      }
      else
        this.items = this.parseData.getDataArray();

      this.totalItemsSelected = 0;
      this.itemsSelected = [];
      
    }).catch(error => {
        console.error('ERROR: '+ JSON.stringify(error));
    });
  }

  
  removeItem(){

   return new Promise((resolve, reject) => {
      for(var i = 0; i < this.parseData.getDataArray().length; i++) {
        if(this.itemsSelected.indexOf(i) > -1)
          this.parseData.getDataArray().splice(i, 1);
      }
      resolve(true);
    });
}

  updateContent(){
    this.zone.run(() => {
      this.getData();
    });
  }

  btnStatus(){
    if(this.items.length == 0)
      return true;
    else
      return false;
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
}
