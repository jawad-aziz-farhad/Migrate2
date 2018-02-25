import {  NavController } from 'ionic-angular';
import { STUDY_CANCELING_MESSAGE, ALERT_TITLE } from '../config/config';
import { Time , AlertProvider } from '../providers';

 export class Stop {

    constructor(private navCtrl: NavController,
                private alert: AlertProvider,
                private time: Time){}
    
    /* ASKING FOR STUDY CONFIRMATION FROM USER, IF USER SAYS YES, 
      * ENDING STUDY, STOPPING TIMER 
      * AND NAVIGATING BACK TO ROOT PAGE
    */            
    studyEndConfirmation(){
        this.alert.presentConfirm(ALERT_TITLE, STUDY_CANCELING_MESSAGE).then(action => {
            if(action == 'yes'){
                this.time.destroyTimer();
                this.navCtrl.popToRoot();
            }
            else
            console.log('User dont want to cancel the Study');  
        })
        .catch(error => console.log("ERROR: " + error));
    }

}