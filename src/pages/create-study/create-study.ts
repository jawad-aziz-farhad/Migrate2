import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController} from 'ionic-angular';
import { AllStudyData , Rounds } from '../../models';
import { ParserProvider , Time} from '../../providers'
/**
 * Generated class for the CreateStudyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-study',
  templateUrl: 'create-study.html',
})
export class CreateStudyPage {
  
  public roundTime: any;
  public all_data: any;
  public round_data: any;
  public studyTitle: any;
  public customer: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams ,
              public viewCtrl: ViewController,
              public parser: ParserProvider,
              public time: Time) {
  }

  ionViewDidLoad() {
    this.studyTitle = '';
    this.roundTime = 3; 
    this.customer = this.navParams.get('customer');
    console.log('ionViewDidLoad CreateStudyPage');
  }

  /* DISMISSING ALERT */
  dismiss(action: string) {
    /* SETTING ALL DATA OBJECTS */
    this.all_data = new AllStudyData();
    this.all_data.setTitle(this.studyTitle);
    this.all_data.setCustomer(this.customer);
    this.all_data.setStudyStartTime(new Date().getTime());
    this.all_data.setStudyEndTime(null);

    /* SETTING ROUNDS OBJECT */
    this.round_data = new Rounds();
    this.round_data.setRoundStartTime(new Date().getTime());

    /* PARSING ROUND DATA AND ALL DATA */
    this.parser.setRounds(this.round_data);
    this.parser.setAllData(this.all_data);

    this.roundTime = this.roundTime * 60; 
    let data = { action: action , roundTime: 10 , title: this.studyTitle};
    this.viewCtrl.dismiss(data);
  }


}
