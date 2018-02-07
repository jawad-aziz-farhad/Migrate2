import { Component , ViewChild , Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimerComponent } from '../../components/timer/timer';
import { NewTimerComponent } from '../../components/new-timer/new-timer';
import { EnterRatingPage} from '../enter-rating/enter-rating';
import { AddFrequencyPage} from '../add-frequency/add-frequency';
import { Time , OperationsProvider , ParseDataProvider , StudyStatusProvider } from '../../providers';
import { StudyData , DummyData} from '../../models';
/**
 * Generated class for the RatingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ratings',
  templateUrl: 'ratings.html',
})
export class RatingsPage {

  @ViewChild(TimerComponent) timer: TimerComponent;
  
  public roundTime: number; 
  public ratings: any;
  public temp: any;
  public element: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams , 
    public time: Time,
    public operations: OperationsProvider,
    public parseData: ParseDataProvider,
    public studyStatus: StudyStatusProvider) {
     
  }

  ionViewDidLoad() {     
    console.log('SelectElementPage');
  }

  ionViewWillEnter() {
   this.ratings = [  40 , 50 , 55 , 60 , 65, 70 , 75 , 80 , 85 , 90 , 95 , 100 , 105 , 110 , 115 , 120 , 125 , 130 , 135 , 'NR' ];
   this.initView()
 }

  /* iNITIALIZING VIEW  */
  initView(){
    this.temp = {};
    this.parseData.getData().setObservationTime(new Date().getTime());
    this.parseData.setData(this.parseData.getData());
    this.getRatings();
  }

  
  /* GETTING RATINGS */
  getRatings() {
     
    this.element = this.navParams.get('element');
    let rating = this.element.rating.toLowerCase().trim();
    /* IF RATING IS FIELD USER INPUT */
    if(rating == 'field user input')
      this.enterRating(this.ratings[0]);
    /* IF RATING IS NOT RATED */  
    else if(rating == 'not rated'){
      this.enterRating(this.ratings[(this.ratings.length - 1)]);
    }
    /* IF RATING IS A NUMBER */  
    else{
      const index = this.ratings.indexOf(parseInt(this.element.rating));
      if(index > -1)
        this.enterRating(this.ratings[index]);
      else
        this.enterRating(this.ratings[0]);
    } 
  }

  /* GOING TO ENTER RATING PAGE */
  goToEnterRating(){
    this._parseTime();
    this.gotoNextPage(EnterRatingPage);
  }

  /* PARSING ROUND TIME TO NEXT PAGE */
  _parseTime(){
    this.timer.stopTimer();
    this.timer.pauseTimer()
    this.time.setTime(this.timer.getRemainingTime());
  }

  /* PARSING ROUND DATA TO NEXT PAGE */
  _parseData(rating: number) {    
    this.parseData.getData().setRating(rating);
    this.parseData.setData(this.parseData.getData());
    console.log("STUDY DATA AT RATING PAGE: " + JSON.stringify(this.parseData.getData()));
  }

  /* GOING TO NEXT PAGE */
  gotoNextPage(page: any){
    this._parseTime();
    this.navCtrl.push(page);
  }

  /* ENTERING RATING FROM CURRENT FORM */
  enterRating(rating){
    this.temp = rating;
    this._parseData(rating);
  }

  /* CONTINUING ROUND AND GOING TO NEXT PAGE AFTER SELECTING RATING */
  continue(rating){
    this.enterRating(rating);
    this.gotoNextPage(AddFrequencyPage);
  }

  getStyle(rating){
    if(this.temp == rating)
      return 'active';
    else
      return 'disabled';  
  }

  /* WHEN USER CANCEL THE STUDY WE WILL KILL TIMER AND NAVIGATE USER TO ROOT PAGE */
  onCancelStudy(event){
    if(event){
      {
        this.timer.killTimer();
        this.studyStatus.setStatus(false);
        this.navCtrl.popToRoot();
      }
    }
  }

  
  
}
