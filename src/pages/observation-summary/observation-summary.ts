import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimerComponent } from '../../components/timer/timer';
import { Time , ParseDataProvider , OperationsProvider, LoaderProvider , ToastProvider, ParserProvider } from '../../providers';
import { Observable } from 'rxjs';
import { SERVER_URL } from '../../config/config';
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
              public parser: ParserProvider) {
    this.show = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationSummaryPage');  
    this.showObservationSummary();  
  }

  showObservationSummary(){
      this.data = this.navParams.get('item');
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

  convertTime(time){
    return new Date(time).toLocaleString();
  }

}
