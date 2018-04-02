import { Component , Renderer, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController } from 'ionic-angular';
import { StudyData } from '../../models';
import { ParseDataProvider , Time} from '../../providers'
import { Keyboard } from '@ionic-native/keyboard';
/**
 * Generated class for the CreateStudyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-study',
  templateUrl: 'create-study.html'
})
export class CreateStudyPage {
  
  public studyData: StudyData;
  public studyTitle: any;
  public customer: any;
  public location: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams ,
              public renderer: Renderer,
              public elementRef: ElementRef,
              public viewCtrl: ViewController,
              public keyboard: Keyboard,
              public parse: ParseDataProvider,
              public time: Time) {
  }

  ionViewDidLoad() {
    this.studyTitle = '';
    this.customer = this.navParams.get('customer');
    this.location = this.navParams.get('location');
    this.setFocus();
  }

  setFocus(){
    let element = this.elementRef.nativeElement.querySelector('input');
    setTimeout(() => {
      this.renderer.invokeElementMethod(element, 'focus', []);   
      this.keyboard.show();
    }, 500);
  }

  /* DISMISSING ALERT */
  dismiss(action: string) {

    /* SETTING ALL DATA OBJECTS */
    this.studyData = new StudyData();
    this.studyData.setTitle(this.studyTitle);
    this.studyData.setCustomer(this.customer);
    this.studyData.setStudyStartTime(new Date().getTime());
    this.studyData.setLocationID(this.location._id);
    this.studyData.setStudyEndTime(null);
    
    this.parse.setStudyData(this.studyData);

    console.log("STUDY DATA: "+ JSON.stringify(this.parse.getStudyData()));
    let data = { action: action , title: this.studyTitle};
    this.viewCtrl.dismiss(data);
  }

}