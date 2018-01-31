import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimerComponent } from '../../components/timer/timer';
import { AddFrequencyPage} from '../add-frequency/add-frequency';
import { Time , OperationsProvider , ParseDataProvider} from '../../providers';
import { StudyData } from '../../models';
/**
 * Generated class for the EnterRatingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-enter-rating',
  templateUrl: 'enter-rating.html',
})
export class EnterRatingPage {

  @ViewChild(TimerComponent) timer: TimerComponent;
  
  public roundTime: number = 0; 
  public rating: any;
  public numbers: any;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams , 
    public time: Time,
    public operations: OperationsProvider,
    public parseData: ParseDataProvider) {

    this.rating = '';
  }

  ionViewDidLoad() {
    this.numbers = ['0','1', '2', '3', '4', '5', '6' , '7','8', '9'];
    console.log('ionViewDidLoad RatingsPage');
  }

  ionViewWillEnter() {
    this.roundTime = this.time.getTime();
    this.timer.startTimer();
  }

  /* CONCATINATING RATING WITH THE PREVIOUS ONE*/
  concatRatings(num){
      this.rating = this.rating + num;
  } 

  /* REMOVING ENTERED RATING */ 
  removeRatings(){
    const length = this.rating.length - 1;
    this.rating = this.rating.slice(0, this.rating.length -1 );
  }

  /* ADDING RATING TO THE ROUND DATA AND MOVING TO NEXT PAGE */
  addRatings(){
    console.log('RATING IS: ' + this.rating);
    this.timer.pauseTimer();
    this.timer.stopTimer();
    this.time.setTime(this.timer.getRemainingTime());
    this._parseData(parseInt(this.rating));
    this.navCtrl.push(AddFrequencyPage);
  }

  /* PARSING DATA */
  _parseData(rating: number) {
    this.parseData.getData().setRating(rating);
    this.parseData.setData(this.parseData.getData());
    console.log("STUDY DATA AT ENTER RATING PAGE: " + JSON.stringify(this.parseData.getData()));
  }

  

}
