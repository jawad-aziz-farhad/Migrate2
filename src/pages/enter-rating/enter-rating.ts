import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddFrequencyPage} from '../add-frequency/add-frequency';
import { Time , OperationsProvider , ParseDataProvider} from '../../providers';
import { FREQUENCY_INPUT_ERROR } from '../../config/config';
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

  public roundTime: number = 0; 
  public rating: any;
  public numbers: Array<number>;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams , 
    public time: Time,
    public operations: OperationsProvider,
    public parseData: ParseDataProvider) {

    this.rating = '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingsPage');
    this.numbers = [0, 1 , 2 , 3 , 4 , 5 , 6 , 7, 8 , 9];
  }

  ionViewWillEnter() {
    this.roundTime = this.time.getTime();
  }

  /* CONCATINATING RATING WITH THE PREVIOUS ONE*/
  concatRatings(num){
    if(this.rating.length == 0 && num == 0)
      console.log(FREQUENCY_INPUT_ERROR);
    else  
      this.rating = this.rating + num;
  } 

  /* REMOVING ENTERED RATING */ 
  removeRatings(){
    this.rating = this.rating.slice(0, this.rating.length -1 );
  }

  /* ADDING RATING TO THE ROUND DATA AND MOVING TO NEXT PAGE */
  addRatings(){
    this._parseData(parseInt(this.rating));
    this.navCtrl.push(AddFrequencyPage);
  }

  /* PARSING DATA */
  _parseData(rating: number) {
    this.parseData.getData().setRating(rating);
    this.parseData.setData(this.parseData.getData());
  }

  /* WHEN USER CANCEL THE STUDY WE WILL KILL TIMER AND NAVIGATE USER TO ROOT PAGE */
  onCancelStudy(event){
    if(event){
      this.time.destroyTimer();
      this.navCtrl.popToRoot();
    }
  }

}
