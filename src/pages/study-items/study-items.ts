import { Component , OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams , ModalController} from 'ionic-angular';
import { Time, ParseDataProvider, AlertProvider, ParserProvider, ToastProvider } from '../../providers';
import { ObservationSummaryPage } from '../observation-summary/observation-summary';
import { SubmitDataProgressPage } from  '../submit-data-progress/submit-data-progress';
import { STUDY_ENDED } from '../../config/config'
import { Stop } from '../../bases';
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
  
  public study_data: any;
  public temp: any;
  public itemsSelected: any;
  public totalItemsSelected: number;

  public stop: Stop;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public parseData: ParseDataProvider,
              public modalCtrl: ModalController,
              public time: Time,
              public alert: AlertProvider,
              public parser: ParserProvider,
              public toast: ToastProvider) {
  }


  ngOnInit(){
    this.getData();
  }
  
  ionViewWillEnter(){
    //this.getData();
  }
  /* GETTING DATA */
  getData(){
    this.totalItemsSelected = 0;
    this.itemsSelected = [];
    this.study_data = this.parser.geAllData();
    this.toast.showBottomToast(STUDY_ENDED);
  }
  /* SHOWING SUMMARY OF SINGLE ITEM */
  showSummary(item, index, sub_index){
    if(index == null)
      index = this.study_data.rounds.length - 1
    this.navCtrl.push(ObservationSummaryPage, {item: item, round_index: index, data_index: sub_index});
  }

  /* CONFIRMATION FOR SUBMITTING ALL THE STUDY DATA  */
  openModal(component: string) {

      let data = null;
      if(component == 'EditTitlePage')
        data = { title: this.study_data.title }

      let modal = this.modalCtrl.create(component, data, { cssClass: 'inset-modal items-page-modal' });
      
      modal.onDidDismiss(data => {

        if(component == 'SubmitDataDialogPage'){
          if(data && data.action == 'submit'){
            this.navCtrl.push(SubmitDataProgressPage);
          }
          else{
            console.log('User does not want to Submit Data.');
          }
        }
        
        else if(component == 'EditTitlePage')
          console.log("Dismiss the Popup.")
        

    
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
        for(let j= rounds[i].data.length - 1; j>=0; j-=1){
          const index = this.itemsSelected.indexOf(rounds[i].data[j])
          if(index > -1){
            rounds[i].data.splice(j,1);
            this.totalItemsSelected--;
          }
        if(rounds[i].data.length == 0)
            rounds.splice(i,1);
      }
    }
    
    this.itemsSelected = [];
  }

  /* START NEXT ROUND */
  startNextRound(){
    this.parseData.clearData();
    this.parseData.clearDataArray();
    this.parser.clearRounds();
    this.time.runTimer();
    this.parser.getRounds().setRoundStartTime(new Date().getTime());
    this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()- (this.navCtrl.length() - 3)));
  }


  /* CONVERTING MILLISECONDS TO TIME STRING */
  convertTime(time){
    return new Date(time).toLocaleTimeString();
  }

  /* CANCELLING STUDY */ 
  cancelStudy() {
    this.stop = new Stop(this.navCtrl,this.alert, this.parseData, this.parser, this.time);
    this.stop.studyEndConfirmation();
  }
}
