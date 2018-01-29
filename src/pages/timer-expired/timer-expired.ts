import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController} from 'ionic-angular';
import { TimerComponent } from '../../components/timer/timer';
import { Time , ParseDataProvider, ParserProvider, StudyStatusProvider } from '../../providers';
import { StudyData, Rounds } from '../../models';
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

  @ViewChild(TimerComponent) timer: TimerComponent;

  constructor(public navCtrl: NavController,
              public navParams: NavParams ,
              public viewCtrl: ViewController,
              public time: Time,
              public parseData: ParseDataProvider,
              public parser: ParserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimerExpiredPage');
  }

  dismiss(value) {

    let data = { action: value};
    this.parser.getRounds().setRoundEndTime(new Date().getTime());
    this.viewCtrl.dismiss(data);
    

      //  if(value.toLowerCase().trim() == 'continue'){
      //     this.parser.getRounds().setRoundData(this.parseData.getDataArray());
      //     this.parser.setRounds(this.parser.getRounds());
      //     this.parser.geAllData().setRoundData(this.parser.getRounds());
      //     /* CLEARING STUDY DATA OBJECT AND ARRAY FOR NEXT ENTRIES AND NEXT ROUND*/
      //     this.parseData.clearDataArray();
      //     this.parser.clearRounds();

      //     this.parser.getRounds().setRoundStartTime(new Date().getTime());
      //  }
      
      // setTimeout(() => {
      //   this.viewCtrl.dismiss(data);
      // }, 100);
      
  }

}
