import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController } from 'ionic-angular';
import { Time } from '../../providers';
import { Timer } from '../../models/timer.interface';

/**
 * Generated class for the StudyOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-study-options',
  templateUrl: 'study-options.html',
})
export class StudyOptionsPage {
  
  private notes: boolean;
  private photo: boolean;
  private timer: Timer;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public time: Time) {
      this.timer = new Timer();          
  }

  ionViewDidLoad() {    
    this.notes = false;
    this.photo = false;
  }

  /* DISMISSING ALERT */
  dismiss(action: string) {
    if(action == null || typeof action == 'undefined') 
      action = 'cancel';
    else if(action == 'end')
      this.endStudy();  
    let data = { action: action, notes: this.notes, photo: this.photo};
    this.viewCtrl.dismiss(data);
  }
  
  updateOption(){
    console.log(this.notes + '\n' + this.photo);
  }

  endStudy(){
    //this.time.setStatus(true);
  }

}
