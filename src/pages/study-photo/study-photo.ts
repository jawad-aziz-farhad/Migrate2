import { Component , ViewChild , ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TimerComponent } from '../../components/timer/timer';
import { NewTimerComponent } from '../../components/new-timer/new-timer';
import { Time , ParseDataProvider , OperationsProvider, LoaderProvider , ToastProvider , AlertProvider,
        SqlDbProvider , NetworkProvider, ParserProvider , StudyStatusProvider} from '../../providers';
import { StudyItemsPage } from '../study-items/study-items';
import { ObservationSummaryPage } from '../observation-summary/observation-summary';
import { MESSAGE , ERROR , FILE_UPLOADED_MESSAGE , FILE_SAVED_LOCALLY } from '../../config/config';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Rounds } from '../../models/index';

/**
 * Generated class for the StudyPhotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-study-photo',
  templateUrl: 'study-photo.html',
})
export class StudyPhotoPage {
  
  @ViewChild(TimerComponent) timer: TimerComponent;

  public isPhotoTaken: boolean;
  public photo : any;
  public roundTime: number = 0;
  public TABLE_NAME : string;
  public isUploaded: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams ,
              public camera: Camera,
              public time: Time,
              public parseData: ParseDataProvider,
              public operations: OperationsProvider,
              public toast: ToastProvider,
              public loader: LoaderProvider,
              public elementRef: ElementRef,
              public file: File, 
              public filePath: FilePath,
              public network: NetworkProvider,
              public sql: SqlDbProvider,
              public alertProvider: AlertProvider,
              public parser: ParserProvider,
              public studyStatus: StudyStatusProvider) {
     
  }

  initView(){
    this.isUploaded = false;
    this.isPhotoTaken = false;
    this.TABLE_NAME = 'Study_Data';
    this.timer.resumeTimer();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudyPhotoPage');
  }

  ionViewWillEnter() {
    this.initView();
  }

  /* TAKING A PHOTO USING MOBILE CAMERA */
  takePhoto() {

    this.camera.getPicture(this.getCameraOptions()).then((imageData) => {
     this.resolvePath(imageData);
    }, (err) => {
        console.error('IMAGE CAPTURE ERROR: ' + err);
    });
  }

  /*SETTING CAMERA OPTIONS */
  setCameraOptions() {    
        const options = {
          quality: 100,
          sourceType: this.camera.PictureSourceType.CAMERA,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };
        return options;
  }

  /* GETTING CAMERA OPTIONS */
  getCameraOptions(): CameraOptions{
    return this.setCameraOptions();
  }

  /* RESOLVING IMAGE PATH */
  resolvePath(imagePath) {
    this.filePath.resolveNativePath(imagePath).then(filePath => {
      
      this.isPhotoTaken = true;
      this.photo = filePath;   
      
      let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
      let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
      
    });
  }
  
  /* CHECKING INTERNET CONNECTION BEFORE UPLOADING IMAGE TO THE SERVER */
  checkInternetConnection() {
    if(!this.network.isInternetAvailable()){
        this._parseData(this.photo);
        this.toast.showToast(FILE_SAVED_LOCALLY);
        this.isUploaded = true;
    }
    else
      this.uploadPhoto();    

  }

  /* UPLOADIN PHOTO TO SERVER */
  uploadPhoto() {
      this.loader.showLoader(MESSAGE);
      let params = {endPoint:'ras_data/study_image' , key :'photo', file: this.photo};
      this.operations.uploadFile(params).then(res => {
        this.loader.hideLoader();
        let response = JSON.parse(res);
        if(response.success){
          this.toast.showToast(FILE_UPLOADED_MESSAGE);
          this._parseData(response.path);
          //this.isUploaded = true;
          this.goNext();
        }
        else{
          this.toast.showToast(ERROR);
        }
      }).catch(error => {
        this.loader.hideLoader();
        this.toast.showToast(ERROR);
      });
  }

  /* PARSING ROUND TIME TO NEXT PAGE */
  _parseTime(){
    console.log('REMAINING TIME AT STUDY PHOTO PAGE: '+ this.timer.getRemainingTime());
    this.timer.stopTimer();
    this.timer.pauseTimer()
    this.time.setTime(this.timer.getRemainingTime());
  }

  /* PARSING DATA */
  _parseData(imagPath: any) {
    this.parseData.getData().setPhoto(imagPath);
    this.parseData.setData(this.parseData.getData());
    this.parseData.setDataArray(this.parseData.getData());
    console.log("STUDY DATA AT STUDY PHOTO PAGE: \n" + JSON.stringify(this.parseData.getData()));
  }
  
  /* GOING TO THE NEXT PAGE */
  goNext() {
    
    this._parseTime();
    this.parseData.clearData();

    /* IF TIMER IS FINISHED, WE ARE ENDING THE STUDY AND GOING TO THE PAGE WHERE ALL DATA FOR STUDY ITEMS WILL BE SHOWN */
    if(this.timer.hasFinished() || this.timer.getRemainingTime() <= 0){
      this.parser.getRounds().setRoundData(this.parseData.getDataArray());
      this.parser.getRounds().setRoundEndTime(new Date().getTime())
      this.parser.setRounds(this.parser.getRounds());
      this.parser.geAllData().setRoundData(this.parser.getRounds());
      this.parser.geAllData().setStudyEndTime(new Date().getTime());
      /* CLEARING STUDY DATA OBJECT AND ARRAY FOR NEXT ENTRIES AND NEXT ROUND*/
      this.parseData.clearDataArray();
      this.parser.clearRounds();
      this.navCtrl.push(StudyItemsPage);
    }
    else
      this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - (this.navCtrl.length() - 3)));
  }

  /* POPPING TO 1st STEP OF OBSERVATION 'SELECT ROLE PAGE'*/
  popToRoot(){
    if(this.navCtrl.length() <= 14)
       this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length()- (this.navCtrl.length() - 3))); 
    else
      this.navCtrl.popToRoot(); 
  }

  /* WHEN USER CANCEL THE STUDY WE WILL KILL TIMER AND NAVIGATE USER TO ROOT PAGE */
  onCancelStudy(event){
    if(event){
      {
        this.timer.killTimer();
        this.studyStatus.setStatus(false);
        this.navCtrl.popToRoot();
      }
    }
  }

  getImage(){
    if(this.isPhotoTaken)
      return this.photo;
    else{
      return 'assets/images/camera.png';
    }  
  }
}

