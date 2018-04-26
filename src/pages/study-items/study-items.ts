import { Component , OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams , ModalController} from 'ionic-angular';
import { Time, ParseDataProvider, AlertProvider, ToastProvider } from '../../providers';
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
    this.study_data = this.parseData.getStudyData();
    this.toast.showBottomToast(STUDY_ENDED);
  }
  /* SHOWING SUMMARY OF SINGLE ITEM */
  showSummary(item, index){
    this.navCtrl.push(ObservationSummaryPage, {item: item, index: index});
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
          console.log("Dismissing the Popup.")
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
    let data = this.study_data.data;
    for (let i = data.length - 1; i >= 0; i -= 1) {       
        const index = this.itemsSelected.indexOf(data[i]);
        if(index > -1){
          data.splice(i,1);
          this.totalItemsSelected--;
        }
        if(data.length == 0)
          data.splice(i,1);
      }
    this.itemsSelected = [];
  }

  /* CONVERTING MILLISECONDS TO TIME STRING */
  convertTime(time){
    return new Date(time).toLocaleTimeString();
  }

  /* CANCELLING STUDY */ 
  cancelStudy() {
    this.stop = new Stop(this.navCtrl,this.alert, this.parseData,  this.time);
    this.stop.endStudy();
  }
}
