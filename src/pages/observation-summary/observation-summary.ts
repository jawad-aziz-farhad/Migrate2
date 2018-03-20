import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ParseDataProvider , ParserProvider, AlertProvider, SqlDbProvider } from '../../providers';
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
  private frequency: string;

  private elements : Array<any> = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams ,
              public parseData: ParseDataProvider,
              public parser: ParserProvider,
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
    this.sql.getAllData('Elements').then(result => {
      this.elements = result;
      this.showObservationSummary();
    }).catch(error => console.error(error));
    
  }
  /* GETTING SUMMARY  */
  showObservationSummary(){
    this.data = null;
    this.data = this.navParams.get('item');
    console.log("SELECTED ITEM: "+ JSON.stringify(this.data));
    this.show = true;
  }
  /* GETTING IMAGE PATH */
  getImage() {
    if(typeof this.data.photo !== 'undefined' && this.data.photo !== null && this.data.photo !== ''){
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
    const round_index = this.navParams.get('round_index');
    if(typeof round_index !== 'undefined')
      time = this.parser.geAllData().getSutdyStartTime();
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

    const round_index = this.navParams.get('round_index');
    const data_index  = this.navParams.get('data_index');
    
    if(!this.isOfflineStudy()){
      this.parser.geAllData().getRoundData()[round_index].data.splice(data_index,1);
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

    const round_index = this.navParams.get('round_index');
    const data_index  = this.navParams.get('data_index');
    
    if(typeof round_index == 'undefined' || typeof data_index == 'undefined')
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

    const round_index = this.navParams.get('round_index');
    const data_index = this.navParams.get('data_index');
    
    if(typeof round_index == 'undefined'){
      if(this.editedElement || this.rating || this.frequency){
        this.updateOfflineStudy();
      }
    }
    
    else{
      
      if(this.rating)
        this.parser.geAllData().getRoundData()[round_index].data[data_index].rating = this.rating ;
      if(this.frequency)
        this.parser.geAllData().getRoundData()[round_index].data[data_index].frequency = this.frequency;
      if(this.editedElement)
        this.parser.geAllData().getRoundData()[round_index].data[data_index].element = this.editedElement; 
      
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

  
}
