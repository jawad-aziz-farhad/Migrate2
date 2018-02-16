import { Component, ViewChild } from '@angular/core';
import { Nav, Platform ,  ModalController, NavController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { Storage } from "@ionic/storage";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Http } from '@angular/http';

/* PAGES */
import { LoginPage } from '../pages/login/login';
import { ProjectsPage } from '../pages/projects/projects';
import { ProfilePage } from '../pages/profile/profile';
import { OfflineStudyDataPage } from '../pages/offline-study-data/offline-study-data';
import { AboutPage } from '../pages/about/about';
import { ReportProblemPage } from '../pages/report-problem/report-problem';
import { HelpPage } from '../pages/help/help';
import { SettingsPage } from '../pages/settings/settings';

/* PROVIDERS  */
import { AuthProvider , AlertProvider, NetworkProvider , SqlDbProvider , OperationsProvider , LoaderProvider ,
         FormBuilderProvider, ToastProvider, Time, StudyStatusProvider, ParserProvider, ParseDataProvider, HeadersProvider } from "../providers/index";
/* STATIC VALUES */
import { SYNC_DONE , MESSAGE , SYNC_DATA_MSG, ERROR, SERVER_URL , BACK_BTN_MESSAGE} from '../config/config';

import { SyncOfflineData } from '../bases/index';

@Component({
  templateUrl: 'app.html'
})
export class MyApp extends SyncOfflineData {

  @ViewChild(Nav) nav: Nav;
  rootPage: any = null;

  pages: Array<{title: string, component: any}>;
    
  constructor(public platform: Platform, 
              public http: Http,
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public storage: Storage,
              public authProvider: AuthProvider,
              public alertProvider: AlertProvider,
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
              public headers: HeadersProvider,
              private screenOrientation: ScreenOrientation,
              public time: Time) {
    super(network,sql,operations,loader,formBuilder,toast,parseData,parser,headers,storage,http);            
    this.initializeApp();
  }

  /* INITIALIZE THE APP */
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
        this.statusBar.styleDefault();
        this.splashScreen.hide();
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
  openModal() {
    let modal = this.modalCtrl.create('LogoutModalPage', null , { cssClass: 'inset-modal logOut-modal' });
        modal.onDidDismiss(data => {
          if(data.action == 'yes')
              this.authProvider.logOut();
          else
              console.log('User dont want to Logout');
        });
    modal.present();
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
      let syncdata = new SyncOfflineData(this.network, this.sql,this.operations,this.loader, this.formBuilder, this.toast,this.parseData, this.parser, this.headers, this.storage, this.http);
      syncdata.checkOfflineCreatedAER();
    });
  }

}

