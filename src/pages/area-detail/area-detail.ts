import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ModalController } from 'ionic-angular';
import { SelectAreaPage } from '../select-area/select-area';
import { StudyData } from '../../models';
import { ParseDataProvider , SqlDbProvider, LoaderProvider, OperationsProvider  } from '../../providers';
import { SERVER_URL  } from '../../config/config';
/**
 * Generated class for the AreaDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-area-detail',
  templateUrl: 'area-detail.html',
})
export class AreaDetailPage {

  public data: StudyData;
  public location: any;
  public project: any;
  public logo: any;
  public selectOptions: any;

  public expanded: boolean = false;
  public itemExpandHeight: number = 800;

  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams ,
              public modalCtrl: ModalController ,
              public parseData: ParseDataProvider,
              public sql: SqlDbProvider,
              public loader: LoaderProvider,
              public operations: OperationsProvider) {
    this.initView();          
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AreaDetailPage');
  }

  initView(){
    this.location = this.navParams.get('location');
    this.project  = this.navParams.get('project');
    this.selectOptions = {
      title: 'Opening Timings',
      mode: 'md'
    };
  }

  /* GETTING BRAND LOGO */
getImage(){
  if(typeof this.project.logo !== 'undefined' && this.project.logo !== null && this.project.logo !== '')
    return SERVER_URL + this.project.logo;
  else
    return 'assets/images/logo.png';  
}


openModal() {

    let modal = this.modalCtrl.create('CreateStudyPage', { customer: this.project , location: this.location }, { cssClass: 'inset-modal create-study-modal' });
  
    modal.onDidDismiss(data => {
      if(data && data.action == 'start'){
        this.navCtrl.push(SelectAreaPage, { project: this.project }); 
      }  
      else
        console.log('USER DONT WANT TO START STUDY.');       
    });
    
    modal.present();
  }

  open_close_Time(from, to) {
    let time = '';
    if(typeof from !== 'undefined' && typeof to !== 'undefined'){
    
      if(from.trim() !== "00:00"){
        if(from.trim() !== "00:00")
          time += from;
        
        if(to.trim() !== "00:00")
          time += '   -   ' + to; 
        else
          time += '     Closed' ;
    }
    else
      time = '    Closed ';
    
  
  }
  
  else
      time = '  Closed ';
    
      return time; 
  }

  

}

 