import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParseDataProvider , AlertProvider, SqlDbProvider } from '../../providers';
import { SERVER_URL, DELETE_MSG, DELETE_TITLE } from '../../config/config';
/**
 * Generated class for the ObservationSummaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-observation-summary',
  templateUrl: 'observation-summary.html',
})
export class ObservationSummaryPage {

  public imagePath: string;
  public data: any;
  public show: boolean;
  private DEFAULT_IMG: string = "assets/images/banner.png";
  
  private editedElement: any;
  private rating: string;
  private frequency: any;

  private elements : Array<any> = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams ,
              public parseData: ParseDataProvider,
              public alert: AlertProvider,
              public sql: SqlDbProvider) {
    this.show = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationSummaryPage');  
    this.getElements();
  }

  /* GETTING ALL ELEMENTS  */
  getElements(){
    this.data = this.navParams.get('item');
    console.log("\n ITEM AT OBSERVATION PAGE: "+ JSON.stringify(this.data));
    /* CHECKING TASK ID */
    let taskID = null;
    if(this.data.task._id)
      taskID = this.data.task._id;
    else
      taskID = this.data.task;

    this.sql.getIDData('Elements', taskID).then(result => {
      this.elements = result;
      this.show = true;
    }).catch(error => console.error(error));
  }

  /* GETTING IMAGE PATH */
  getImage() {
    if(this.data.photo){
      /* IF FILE IS NOT UPLOADED YET AND WE HAVE THE LOCAL FILE PATH */
      if(this.data.photo.indexOf('file://') == -1)
        this.imagePath = SERVER_URL + this.data.photo;
      /* IF FILE IS UPLOADED */  
      else
        this.imagePath = this.data.photo;   
    }
    else
      this.imagePath = this.DEFAULT_IMG;
    
      return this.imagePath;
  }

  /* CONVERTING MILLISECONDS TO LOCALE TIME */
  convertTime(){
    let time = null;
    const index = this.navParams.get('index');
    if(typeof index !== 'undefined')
      time = this.parseData.getStudyData().getSutdyStartTime();
    else
      time = this.data.studyStartTime;
      
    return new Date(time).toLocaleString(); 
  }

  /* ASKING FOR CONFIRMATION FROM USER */
  deletConfirmation(){
    this.alert.presentConfirm(DELETE_TITLE, DELETE_MSG).then(res => {
      if(res == 'yes')
        this.deleteItem();
    });
  }

  /* IF USER SAYS YES, THEN WE WILL DELETE ITEM FROM ARRAY AND MOVE BACK TO STUDY ITEMS PAGE */  
  deleteItem(){

    const index = this.navParams.get('index');
    
    if(!this.isOfflineStudy()){
      this.parseData.getStudyData().getData().splice(index,1);
      this.navCtrl.pop();
    }
    else
      this.deleteFromSQLite();
  }

  /* DELETING RECORD FROM SQLite TABLE */
  deleteFromSQLite(){
    this.sql.deleteRecord('Study_Data', {id: this.data.id}).then(result => {
      if(result)
        this.navCtrl.pop();
    }).catch(error => {
      console.error("DELETE ERROR: ")+ JSON.stringify(error);
    });
  }

  /* CHECKING STUDY WHETER ITS COMING FROM SQLite OR FROM CLASS OBJECTS */
  isOfflineStudy() {

    const index = this.navParams.get('index');
    if(typeof index == 'undefined')
      return true;
    else
      return false;  
  }
  
  /* CHECKING FOR THE VALUES,
    ELEMENT,
    FREQUENCY,
    RATING
    IF ANY VALUE CHANGES, THIS METHOD WILL RETURN TRUE AND UPDATA BUTON WILL BE ENABLE
  */
  isUpdateAble(){
    if((this.editedElement && (this.editedElement !== this.data.element)) || (this.rating && (this.rating !== this.data.rating)) || (this.frequency && (this.data.frequency !== this.frequency)))
      return true;
    else
      return false;
  }


  /* EDITING VALUE OF RATING AND FREQUENCY */
  edit(value, _for){    
    if(_for == 'frequency')
      this.frequency = value;
    else if(_for == 'rating')
      this.rating = value;
  }

  /* UPDATING STUDY DATA */
  updateStudyData(){

    const index = this.navParams.get('index');
    
    if(typeof index == 'undefined'){
      if(this.editedElement || this.rating || this.frequency){
        this.updateOfflineStudy();
      }
    }
    
    else{
      
      if(this.rating)
        this.parseData.getStudyData().getData()[index].setRating(this.rating) ;
      if(this.frequency)
        this.parseData.getStudyData().getData()[index].setFrequency(this.frequency);
      if(this.editedElement)
        this.parseData.getStudyData().getData()[index].setElement(this.editedElement); 
      
      this.navCtrl.pop();  
    }
  } 

  /* UPDATING OFFLINE STUDY DATA */
  updateOfflineStudy(){
    
    let data = { element: null, rating: null, frequency: null , id: null} ;
    if(this.editedElement)
      data.element = this.editedElement._id;
    else
      data.element = this.data.element._id;  

    if(this.rating)
      data.rating = this.rating;
    else
      data.rating = this.data.rating;

    if(this.frequency)
      data.frequency = this.frequency; 
    
    else
      data.frequency = this.data.frequency;

     data.id = this.data.id; 
      
    this.sql.updateTable('Study_Data',null, data).then(result => {
      this.navCtrl.pop();
    }).catch(error => console.error("UPDATE OFFLINE DATA ERROR: "+ JSON.stringify(error)));
    
  }

  getRating(element: any){
    let rating = null
    /* IF SELECTED ELEMENT HAS RATING OF 1 */
    if(element.rating == 1)
      rating = 'Not Rated';
    /* IF SELECTED ELEMENT OR PROJECT HAS RATING 2 */
    else if(rating == '2')
      rating = 100;
    else
      rating == 0;
    
    return rating;
      
  }

  
}
