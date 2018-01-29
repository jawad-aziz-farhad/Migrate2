import { Component, ViewChild } from '@angular/core';
import { Nav, Platform , AlertController , ModalController, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Storage } from "@ionic/storage";
import { ScreenOrientation } from '@ionic-native/screen-orientation'
import { Observable } from 'rxjs';
import * as $ from 'jQuery';

/* PAGES */
import { LoginPage } from '../pages/login/login';
import { AreasPage } from '../pages/areas/areas';
import { ProjectsPage } from '../pages/projects/projects';
import { ProfilePage } from '../pages/profile/profile';
import { CreateAreaPage } from '../pages/create-area/create-area';
import { OfflineStudyDataPage } from '../pages/offline-study-data/offline-study-data';
import { AboutPage } from '../pages/about/about';
import { ReportProblemPage } from '../pages/report-problem/report-problem';
import { HelpPage } from '../pages/help/help';
import { SettingsPage } from '../pages/settings/settings';

/* PROVIDERS  */
import { AuthProvider , AlertProvider, NetworkProvider , SqlDbProvider , OperationsProvider , LoaderProvider ,
         FormBuilderProvider, ToastProvider, Time, StudyStatusProvider, ParserProvider, ParseDataProvider } from "../providers/index";
/* MODELS */         
import { StudyData } from '../models//study-data.interface';
import { AllStudyData, Rounds } from '../models/index';

/* STATIC VALUES */
import { SYNC_DONE , MESSAGE , SYNC_DATA_MSG, ERROR, SERVER_URL , BACK_BTN_MESSAGE} from '../config/config';
import { RatingsPage } from '../pages/ratings/ratings';
import { AddFrequencyPage } from '../pages/add-frequency/add-frequency';
import { StudyPhotoPage } from '../pages/study-photo/study-photo';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any = null;

  pages: Array<{title: string, component: any}>;

  private TABLE_NAME: string = 'Study';
  private TABLE_NAME_1: string = 'Study_Data';
  private user: any;
  private isMenuOpened: boolean;
  private lastTimeBackPress: any = 0;
  private timePeriodToExit: any = 3000;

 
  private offlinedataObj = {
    name: null,
    studyStartTime: null,
    studyEndTime: null,
    customerID: null,
    projectID: null,
    userID: null,
    rounds: []
  };

  private offlineData: Array<StudyData> = [];
  private offlineData$: Array<any> = [];
  

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public storage: Storage,
              public authProvider: AuthProvider,
              public alertProvider: AlertProvider,
              public alertCtrl: AlertController , 
              public modalCtrl: ModalController,
              public menuCtrl: MenuController,
              public network: NetworkProvider,
              public _network: Network,
              public sql: SqlDbProvider,
              public operations: OperationsProvider,
              public loader: LoaderProvider,
              public formBuilder: FormBuilderProvider,
              public toast: ToastProvider,
              public parseData: ParseDataProvider,
              public parser: ParserProvider,
              public studyStatus: StudyStatusProvider,
              private screenOrientation: ScreenOrientation,
              public time: Time) {

    this.initializeApp();
  }

  /* INITIALIZE THE APP */
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        //this.rootPage = CreateAreaPage;
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.registerBackButton();
        this.checkSession();
        this.checkingInternetConnection();
      
    });
    
  }

  /* REGISTERING BACK BUTTON TO HANDLE HARDWARE BUTTON CLICKED */
  registerBackButton(){
    let backButton = this.platform.registerBackButtonAction(() => {
      var stackSize = this.nav.length();
      if(stackSize <= 1)
        this.askForPressAgain();
      if(stackSize < 4)
        this.nav.pop({});
      else
        this.cancelStudy();  
    },1);

  }

  /* ASKING FOR BACK BUTTON PRESS ONE MORE TIME, IF STACK SIZE IS LESS THAN 1 or EMPTY */
  askForPressAgain(){
    let view = this.nav.getActive();
    if (view.component.name == 'ProjectsPage' || view.component.name == 'LoginPage') {
      if ((new Date().getTime() - this.lastTimeBackPress) < this.timePeriodToExit) {
        this.platform.exitApp(); //Exit from app
      } else {
        this.toast.showBottomToast(BACK_BTN_MESSAGE);
        this.lastTimeBackPress = new Date().getTime();
      }
    }
    
  }

  /* CANCELING STUDY ON BACK BUTTON PRESSED */
  cancelStudy() {
    
    var message = 'Are you sure that you want to cancel this Study ?'
    var title: 'Efficiency Study';
    
    this.alertProvider.presentConfirm(title,message).then(action => {
        if(action == 'yes') {
          this.studyStatus.setStatus(false);
          this.nav.popToRoot();
        }
        else
          console.log('User dont want to cancel the Study');  
    })
    .catch(error => {
      console.log("ERROR: " + error);
    });
  }

  /* CHECKING LOGIN SESSION AND ROUTING ACCORDINGLY */
  checkSession() {
        this.isMenuOpened = false;
        this.authProvider.authUser.subscribe(jwt => {
            if(jwt) {              
                this.rootPage = ProjectsPage;
                // used for an example of ngFor and navigation
                this.pages = [
                  { title: 'Projects',component: ProjectsPage },
                  { title: 'Sync Data' , component: OfflineStudyDataPage },
                  { title: 'Help', component: HelpPage },
                  { title: 'Settings', component: SettingsPage },
                  { title: 'Report a Problem', component: ReportProblemPage }

                ];
                this._getUser();  
            }
            else
              this.rootPage = LoginPage;
        });
    
        this.authProvider.checkLogin();
  }

  /* OPENING PAGE  */
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario    
    this.nav.setRoot(page.component);
  }

  /*GETTING CONFIRMATION AND DOING LOGOUT IF USER SAYS YES */
  confirmLogout() {

    var message = 'Are you sure that you want to logout ?'
    var title: 'Confirm Logout';

    this.alertProvider.presentConfirm(title,message).then(action => {
        if(action == 'yes')
          this.authProvider.logOut();
        else
          console.log('User dont want to Logout');  
    })
    .catch(error => {
      console.log("LOGOUT CONFIRMATION ERROR: " + error);
    });
  }

  openModal() {
       
    let modal = this.modalCtrl.create('LogoutModalPage', null , { cssClass: 'inset-modal' });
        modal.onDidDismiss(data => {
          if(data.action == 'yes')
              this.authProvider.logOut();
          else
              console.log('User dont want to Logout');    

        });
    modal.present();
  }

  deleteDBandLogout() {
    this.sql.deleteDB().subscribe(result => {
      this.authProvider.logOut();
    },
    error => {
        this.handleError();
    });
  }

  /* GETTING CURRENT USER INFO FROM LOCAL STORAGE */
  getUser(){
    this.storage.get('currentUser').then(user => {
      this.offlineData$[0].userID = user._id;
      this.syncData();
    });
  }

  /* SHOWING PROFILE INFO ON CLICKING PROFILE IMAGE */
  showProfile(user) {
    let modal = this.modalCtrl.create('ProfilePage',{ user : user }, { cssClass: 'inset-modal' });
     modal.onDidDismiss(data => {
          console.log('PROFILE PAGE MODAL DISMISSED.');  
     });
 
     modal.present();
  }

  /* GETTING CURRENT USER INFO FROM LOCAL STORAGE */
  _getUser(){
    this.storage.get('currentUser').then(user => {
      this.isMenuOpened = true;
      this.user = user;
    });
  }

  /* GETTING PROFILE IMAGE */
  getProfileImage(){
    
    if(typeof this.user.userimage !== 'undefined' && this.user.userimage !== null && this.user.userimage !== ''){
        var image = this.user.userimage.split('/profile_images')[1];
        var imagePath = SERVER_URL + 'assets/profile_images/' + this.user.userimage.split('/profile_images')[1];
        return imagePath;
    }
    else
        return 'assets/images/person.jpg';
  }
  
  /* CHECKING INTERNET CONNECTION */
  checkingInternetConnection() {
    
    let disconnectSub = this._network.onDisconnect().subscribe(() => {
      console.log('you are offline');
    });
    
    let connectSub = this._network.onConnect().subscribe(()=> {
      console.log('you are online');
      this.checkOfflineData();
    });

  }

  /* CHECKING OFFLINE STUDY DATA WHEN INTERNET CONNECTION IS AVAILABLE */ 
  checkOfflineData(){
     this.sql.isDataAvailable(this.TABLE_NAME).then(result => {
        if(result)
          this.getOfflineData(this.TABLE_NAME);        
        else
           console.log('NO DATA AVAILABLE.');
      }).catch(error => {
        console.log('ERROR: ' + JSON.stringify(error));
        return false;
      })
  }
  /* GETTING OFFLINE DATA AND SYNCING IT TO THE SERVER */
  getOfflineData(table){
    this.sql.getAllData(table).then(result => {
        if(result && result.length > 0)
          this.handleStudies(result); 
        else
          console.log('NO DATA AVAILABLE.');
    }).catch(error => {
      this.handleError();
    })
  }

  handleStudies(data){
    /* INITIALIZING ARRAY BEFORE PUSHING DATA INTO IT */
    this.offlineData$ = [];
    $(data).each((index,element) => {
      this.getSingleStudyData(element.id)
    });
  }

  /* GETTING SINGLE STUDY DATA FOR GIVEN ID */
  getSingleStudyData(studyID){
    this.sql.getOfflineStudyData(studyID).then(result => {
      this.buildStudyData(result);
    }).catch(error => {
      this.handleError();
    });
  }

  /* SETTING VALUES OF STUDY TO OBJECT AND PUSHGING IN ARRAY */
  buildStudyData(data){
    var element = data[0];
    this.offlinedataObj.name = element.title; 
    this.offlinedataObj.studyStartTime = element.studyStartTime;
    this.offlinedataObj.studyEndTime = element.studyEndTime;
    this.offlinedataObj.customerID = element.customer.customer_id;
    this.offlinedataObj.projectID = element._id;
    this.offlineData$.push(this.offlinedataObj);
    this.buildRoundsData(data);
  }

  /* BUILDING ROUNDs DATA AND PUSHING IT IN ROUNDS ARRAY */
  buildRoundsData(data) {
    
    var s_Time = ''; var e_Time = '';

    $(data).each((index, element) => {
      /* IF TIME IS SAME, THAT MEANS THIS OBSERVATION IS OCCURED IN THE SAME ROUND */
      if(s_Time == element.roundStartTime && e_Time == element.roundEndTime){
        this.offlineData.push(this.getData(element));
        if((index + 1) == data.length){
          this.parser.getRounds().setRoundStartTime(element.roundStartTime)
          this.parser.getRounds().setRoundEndTime(element.roundEndTime);
          this.parser.getRounds().setRoundData(this.offlineData);
          this.offlineData$[0].rounds.push(this.parser.getRounds());
          this.parser.clearRounds();
          this.offlineData = [];
        }
      }

      else{
        if(this.offlineData.length > 0){
          this.parser.getRounds().setRoundData(this.offlineData);
          this.offlineData$[0].rounds.push(this.parser.getRounds());
        }
        
        this.parser.clearRounds();
        this.offlineData = [];
        this.parser.getRounds().setRoundStartTime(element.roundStartTime)
        this.parser.getRounds().setRoundEndTime(element.roundEndTime);
        this.offlineData.push(this.getData(element));
      } 
      
      s_Time = element.roundStartTime;
      e_Time = element.roundEndTime;
     
    }); 
    
    this.collectOfflineImage();
  }

  /* GETTING STUDY DATA FROM EACH ELEMENT AND RETURNING IT IN THE FORM OF AN OBJECT */
  getData(element){
    var data = new StudyData();
    data.setArea(element.area);
    data.setElement(element.element);
    data.setRole(element.role);
    data.setRating(element.rating);
    data.setNotes(element.notes);
    if(element.observationTime.indexOf('NaN') > -1)
    data.setObservationTime("00:02");
    else
      data.setObservationTime(element.observationTime);
    data.setPhoto(element.photo);
    return data;
  }

  /* COLLECTING OFFLINE IMAGES TO UPLOAD THEM TO THE SERVER AND SAVED THE UPLOADED PATHS ON THEIR LOCATIONS */
  collectOfflineImage() {
    var images = [];
    $(this.offlineData$[0].rounds).each((index, element) => {      
        $(element.data).each((sub_index, sub_element) => {
          var imageObj = {roundIndex: null, dataIndex: null, photo: null};
            if(typeof sub_element.photo !== 'undefined' && sub_element.photo !== null && sub_element.photo.indexOf('file:///') > -1) {
              imageObj.photo = sub_element.photo;
              imageObj.dataIndex = sub_index;
              imageObj.roundIndex = index;
              images.push(imageObj);
            }
        });
    });
    
    this.uploadAllImages(images);
    
  }

  /* CHECKING FOR STUDY DATA IMAGES WHICH ARE NOT UPLOADED YET AND UPLOADING THEM */
  uploadAllImages(images) {

    this.loader.showLoader(SYNC_DATA_MSG);
    this.uploadImages(images).subscribe(result => {
      this.loader.hideLoader();
      $(result).each((index,element) => {
        var response = JSON.parse(element.response);
        $(images).each((sub_index,sub_element) => {
          if((index == sub_index) && (response.success)){
            this.offlineData$[0].rounds[0].data[sub_element.dataIndex].photo = response.path ;
          }
        });
      });
      
      this.getUser();
    },
    error => {
      this.loader.hideLoader();
      this.handleError();
    });
    
  }

  /* COMBINING MULTIPLE OBSERVABLES TO UPLOAD MULTIPLE IMAGES */
  uploadImages(images){
    return Observable.forkJoin(this.makeImageRequests(images)).map((data: any) => {
      return data;
    });
  }

  /* MAKING ARRAY OF OBSERVABLES */
  makeImageRequests(images){
    var observbeAbleArray  = [];
    $(images).each((index,element) => {
      observbeAbleArray.push(this.operations._uploadFile(element.photo));
    });
    return observbeAbleArray;
  }

  /* SYNCING DATA TO SERVER */
  syncData() {    
    this.operations.addData(this.offlineData$[0], 'ras_data/add').subscribe(result => {
        console.log("RAS RESULT: " + JSON.stringify(result));
        if(result.success)
          this.dropTable();
        else
          this.handleError();
    }),
    error => {
      this.handleError();
      console.log('ERROR: '+ JSON.stringify(error));
    };
  }

  /* DROPPING SQL TABLE AFTER SYNCING DATA */
  dropTable(){
    this.sql.dropTable(this.TABLE_NAME_1).then(res => {
      this.loader.hideLoader();
      this.toast.showToast(SYNC_DONE);
    }).catch(error => {
      this.handleError();
      console.error('ERROR: '+ JSON.stringify(error));
    })
  }

  /*HANDLING ERRORS */
  handleError(){
    this.loader.hideLoader();
    this.toast.showToast(ERROR);
  }


  

}

