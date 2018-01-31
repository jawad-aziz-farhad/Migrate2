import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimerComponent } from '../../components/timer/timer';
import { Time , ParseDataProvider , OperationsProvider, LoaderProvider , ToastProvider, ParserProvider, AlertProvider } from '../../providers';
import { Observable } from 'rxjs';
import { SERVER_URL, DELETE_MSG, DELETE_TITLE } from '../../config/config';
/**
 * Generated class for the ObservationSummaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-observation-summary',
  templateUrl: 'observation-summary.html',
})
export class ObservationSummaryPage {

  public imagePath: string;
  public data: any;
  public show: boolean;
  private DEFAULT_IMG: string = "assets/images/banner.png";
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams ,
              public parseData: ParseDataProvider,
              public parser: ParserProvider,
              public alert: AlertProvider) {
    this.show = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationSummaryPage');  
    this.showObservationSummary();  
  }
  /* GETTING SUMMARY  */
  showObservationSummary(){
      const round_index = this.navParams.get('round_index');
      const data_index  = this.navParams.get('data_index');
      this.data = this.parser.geAllData().getRoundData()[round_index].data[data_index];
      this.show = true;
  }
  /* GETTING IMAGE PATH */
  getImage() {
    if(typeof this.data.getPhoto() !== 'undefined' && this.data.getPhoto() !== null && this.data.getPhoto() !== ''){
      /* IF FILE IS NOT UPLOADED YET AND WE HAVE THE LOCAL FILE PATH */
      if(this.data.getPhoto().indexOf('file://') == -1)
        this.imagePath = SERVER_URL + this.data.getPhoto();
      /* IF FILE IS UPLOADED */  
      else
        this.imagePath = this.data.getPhoto();   
    }
    else
      this.imagePath = this.DEFAULT_IMG;
    
      return this.imagePath;
  }

  /* CONVERTING MILLISECONDS TO LOCALE TIME */
  convertTime(time){
    return new Date(time).toLocaleString();
  }

  /* ASKING FOR CONFIRMATION FROM USER */
  deletConfirmation(){
    this.alert.presentConfirm(DELETE_TITLE, DELETE_MSG).then(res => {
      if(res == 'yes')
        this.deleteItem();
    });
  }

  /* IF USER SAYS YES, THEN WE WILL DELETE ITEM FROM ARRAY AND MOVE BACK TO STUDY ITEMS PAGE */  
  deleteItem(){
    const round_index = this.navParams.get('round_index');
    const data_index  = this.navParams.get('data_index');
    this.parser.geAllData().getRoundData()[round_index].data.splice(data_index,1);
    this.navCtrl.pop();
  }

}
