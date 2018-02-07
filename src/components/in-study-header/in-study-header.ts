import { Component, ViewChild , Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ViewController} from 'ionic-angular';
import { AlertProvider, StudyStatusProvider} from '../../providers';
import { ALERT_TITLE, STUDY_CANCELING_MESSAGE, ERROR } from '../../config/config';
import { TimerComponent } from '../../components/timer/timer';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { PopOverPage } from '../../pages/pop-over/pop-over';
import { PrivacyPolicyPage } from '../../pages/privacy-policy/privacy-policy';
import { TermsOfServicesPage } from '../../pages/terms-of-services/terms-of-services';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { timer } from 'rxjs/observable/timer';
/**
 * Generated class for the InStudyHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'in-study-header',
  templateUrl: 'in-study-header.html'
})
export class InStudyHeaderComponent {

  @ViewChild(TimerComponent) timer: TimerComponent;
  @Input() title: string;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private menuCtrl: MenuController,
              private viewCtrl: ViewController,
              private alertProvider: AlertProvider,
              private popoverCtrl: PopoverController,
              private modalCtrl: ModalController,
              protected navCtrl: NavController,
              protected studyStatus: StudyStatusProvider
              ) {     
                
  }


  /* OPENING MENU */
  openMenu(){
    if(this.studyStatus.getStatus())
       this.cancelStudy();
    else
      this.menuCtrl.open();
   }

  /* CANCELLING STUDY */ 
  cancelStudy() {
   
    this.alertProvider.presentConfirm(ALERT_TITLE , STUDY_CANCELING_MESSAGE).then(action => {
        if(action == 'yes')
          this.cancel.emit(true);
        else
          this.cancel.emit(false);;  
    })
    .catch(error => {
      console.log("ERROR: " + error);
    });
  }


}
