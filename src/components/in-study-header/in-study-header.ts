import { Component , Input } from '@angular/core';
import { NavController, MenuController} from 'ionic-angular';
import { AlertProvider, Time } from '../../providers';
import { Stop } from '../../bases';
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

  @Input() title: string;

  constructor(private navCtrl: NavController,
              private alertProvider: AlertProvider,
              private time: Time
              ) {  
  }
  /* CANCELLING STUDY */ 
  cancelStudy() {
    let stop = new Stop(this.navCtrl,this.alertProvider, this.time);
    stop.studyEndConfirmation();

  }


}
