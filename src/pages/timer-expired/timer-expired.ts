import { Component, ViewChild} from '@angular/core';
import { IonicPage, ViewController} from 'ionic-angular';
import { Time , ParserProvider  } from '../../providers';
/**
 * Generated class for the TimerExpiredPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timer-expired',
  templateUrl: 'timer-expired.html',
})
export class TimerExpiredPage {

  constructor(public viewCtrl: ViewController,
              public parser: ParserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimerExpiredPage');
  }

  dismiss(value) {
    let data = { action: value};
    this.parser.getRounds().setRoundEndTime(new Date().getTime());
    this.viewCtrl.dismiss(data);
  }

}
