import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ParseDataProvider , OperationsProvider, LoaderProvider , ToastProvider ,
         NetworkProvider } from '../../providers';
import { MESSAGE , ERROR , FILE_UPLOADED_MESSAGE , FILE_SAVED_LOCALLY } from '../../config/config';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

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
  
  public isPhotoTaken: boolean;
  public photo : any;
  public roundTime: number = 0;
  public TABLE_NAME : string;
  public isUploaded: boolean;

  constructor(public navCtrl: NavController, 
              public camera: Camera,
              public parseData: ParseDataProvider,
              public operations: OperationsProvider,
              public toast: ToastProvider,
              public loader: LoaderProvider,
              public network: NetworkProvider,
              public file: File, 
              public filePath: FilePath,
              ) {
     
  }

  initView(){
    this.isUploaded = false;
    this.isPhotoTaken = false;
    this.TABLE_NAME = 'Study_Data';
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
    });
  }
  
  /* CHECKING INTERNET CONNECTION BEFORE UPLOADING IMAGE TO THE SERVER */
  checkInternetConnection() {
    if(!this.network.isInternetAvailable()){
      this.toast.showToast(FILE_SAVED_LOCALLY);
      this.goBack(this.photo);
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
        console.log("IMAGE RESPONSE: "+ JSON.stringify(response));
        if(response.success){
          this.toast.showToast(FILE_UPLOADED_MESSAGE);
          this.goBack(response.path);
        }
        else
          this.toast.showToast(ERROR);
        
      }).catch(error => {
        this.loader.hideLoader();
        this.operations.handleError(JSON.parse(error));
      });

  }

  getImage(){
    if(this.isPhotoTaken)
      return this.photo;
    else{
      return 'assets/images/camera.png';
    }  
  }

  /* GOING BACK TO THE FREQUENCY PAGE */
  goBack(imagPath: any){
    // this.parseData.getData().setPhoto(imagPath);
    // this.parseData.setData(this.parseData.getData());
    this.parseData.getData().setPhoto(imagPath);
    this.parseData.setData(this.parseData.getData());
    this.navCtrl.pop();
  }

}

