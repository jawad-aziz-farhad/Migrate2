import { Component , Input } from '@angular/core';
import { NavController} from 'ionic-angular';
import { AlertProvider, Time, ParseDataProvider } from '../../providers';
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
              private parseData: ParseDataProvider,
              private time: Time
              ) {  
  }
  /* CANCELLING STUDY */ 
  cancelStudy() {
    let stop = new Stop(this.navCtrl,this.alertProvider,this.parseData,this.time);
    stop.studyEndConfirmation();

  }


}
