import { Component , Input, ViewChild } from '@angular/core';
import { Nav, Platform , AlertController , ModalController} from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { LoginPage } from '../../pages/login/login';
import { ProjectsPage } from '../../pages/projects/projects';
import { ProfilePage } from '../../pages/profile/profile';
import { CreateAreaPage } from '../../pages/create-area/create-area';
import { OfflineStudyDataPage } from '../../pages/offline-study-data/offline-study-data';
import { AboutPage } from '../../pages/about/about';
import { HelpPage } from '../../pages/help/help';
import { SettingsPage } from '../../pages/settings/settings';
import { ReportProblemPage } from '../../pages/report-problem/report-problem';
import { AuthProvider } from '../../providers/auth/auth';
import { AuthConfig } from 'angular2-jwt';
import { SERVER_URL } from '../../config/config';
/**
 * Generated class for the NavMenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'nav-menu',
  templateUrl: 'nav-menu.html'
})
export class NavMenuComponent {

  @ViewChild(Nav) nav: Nav;
  private pages: any;
  private user: any;
  private isMenuOpened: boolean;

  constructor(private modalCtrl: ModalController,
              private storage: Storage,
              private auth: AuthProvider) {
    console.log('Hello NavMenuComponent Component');
    this.initMenu();
  }

  initMenu() {
    this.isMenuOpened = false;
    this.pages = [
      { title: 'Projects',component: ProjectsPage },
      { title: 'Sync Data' , component: OfflineStudyDataPage },
      { title: 'Help', component: HelpPage },
      { title: 'Settings', component: SettingsPage },
      { title: 'Report a Problem', component: ReportProblemPage },
      { title: 'Log Out', component: '' }
    ];

    this.getUser();
  }

  /* OPENING PAGE  */
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.title !== 'Log Out')
      this.nav.setRoot(page.component);
    else
        this.openModal();  
  }

  openModal() {
    
       let modal = this.modalCtrl.create('LogoutModalPage', null , { cssClass: 'inset-modal' });
        modal.onDidDismiss(data => {
          if(data.action == 'yes')
              this.auth.logOut();
          else
              console.log('User dont want to Logout');
        });
    
        modal.present();
      
  }

  /* GETTING CURRENT USER INFO FROM LOCAL STORAGE */
  getUser(){
    this.storage.get('currentUser').then(user => {
      this.isMenuOpened = true;
      console.log("USERS INFO: " + JSON.stringify(user));
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

}
