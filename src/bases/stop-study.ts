import {  NavController } from 'ionic-angular';
import { STUDY_CANCELING_MESSAGE, ALERT_TITLE } from '../config/config';
import { Time , AlertProvider, ParseDataProvider, ParserProvider } from '../providers';

 export class Stop {

    constructor(private navCtrl: NavController,
                private alert: AlertProvider,
                private parse: ParseDataProvider,
                private parser: ParserProvider,
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

   /* CLEARING PARSER DATA */ 
   clearStudyData(){
    this.parse.clearData();
    this.parser.clearRounds();
    this.parser.clearAllData();
   } 

}