import {  NavController } from 'ionic-angular';
import { STUDY_CANCELING_MESSAGE, ALERT_TITLE } from '../config/config';
import { Time , AlertProvider, ParseDataProvider } from '../providers';
import { StudyItemsPage } from '../pages/study-items/study-items';

 export class Stop {

    constructor(private navCtrl: NavController,
                private alert: AlertProvider,
                private parse: ParseDataProvider,
                private time: Time){}
    
    /* ASKING FOR STUDY CONFIRMATION FROM USER, IF USER SAYS YES, 
      * ENDING STUDY, STOPPING TIMER 
      * AND NAVIGATING BACK TO ROOT PAGE
    */            
    studyEndConfirmation() {
        this.alert.presentConfirm(ALERT_TITLE , STUDY_CANCELING_MESSAGE).then(action => {
            if(action == 'yes'){              
               this.time.destroyTimer();
               this.parseData();
               //this.clearStudyData();
               this.navCtrl.push(StudyItemsPage);
            }
            else
                console.log('User dont want to cancel the Study');  
        })
        .catch(error => console.log("ERROR: " + error));
    }

    parseData(){
        let data = this.parse.getData();
        data.setTime(this.time.ticks);
         /* IF USER HAS NOT ENTERED FREQUENCY, SETTING IT TO 0 */
        if(this.parse.getFrequency() == 0 || this.parse.getFrequency() == null)
          this.parse.setFrequency(0);
        /* SETTING FREQUENCY */
        data.setFrequency(this.parse.getFrequency());
        /* IF NO NOTES ADDED FOR THIS OBSERVATION */
        if(!data.getNotes())
          data.setNotes(null);
        /* IF NO PHOTO ADDED FOR THIS OBSERVATION */
        if(!data.getPhoto())
          data.setPhoto(null);
        
        this.parse.setData(data);
        data = this.parse.getData();
        this.parse.setDataArray(this.parse.getData());

        /* SETTING ALL STUDY DATA */
        this.parse.getStudyData().setStudyEndTime(new Date().getTime());
        this.parse.getStudyData().setData(this.parse.getDataArray());
        this.parse.setData(this.parse.getData());
    }

   /* CLEARING PARSER DATA */ 
   clearStudyData(){
    this.parse.clearData();
    this.parse.clearDataArray();
   } 



}