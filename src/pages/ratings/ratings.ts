import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnterRatingPage} from '../enter-rating/enter-rating';
import { AddFrequencyPage} from '../add-frequency/add-frequency';
import { Time , OperationsProvider , ParseDataProvider } from '../../providers';
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

  public roundTime: number; 
  public ratings: any;
  public temp: any;
  public element: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams , 
    public time: Time,
    public operations: OperationsProvider,
    public parseData: ParseDataProvider) {     
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
    this.enterRating(this.ratings[0]);
  }
  
  /* GOING TO ENTER RATING PAGE */
  goToEnterRating(){
    this.gotoNextPage(EnterRatingPage);
  }

  /* PARSING ROUND DATA TO NEXT PAGE */
  _parseData(rating: number) {    
    this.parseData.getData().setRating(rating);
    this.parseData.setData(this.parseData.getData());
    console.log("STUDY DATA AT RATING PAGE: " + JSON.stringify(this.parseData.getData()));
  }

  /* GOING TO NEXT PAGE */
  gotoNextPage(page: any){
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
    if(event)
      {
        this.time.destroyTimer();
        this.navCtrl.popToRoot();
      }
  }
  
}
