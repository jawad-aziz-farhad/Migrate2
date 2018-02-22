import { Component , Input, ViewChild } from '@angular/core';
import { ModalController, NavController, MenuController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { SERVER_URL, ERROR } from '../../config/config';
import { Observable } from 'rxjs';
import { ProfilePage } from '../../pages/profile/profile';
import { NetworkProvider, StudyStatusProvider, AlertProvider , Time} from '../../providers';
import { PopoverController } from 'ionic-angular';
import { PopOverPage } from '../../pages/pop-over/pop-over';
import { TermsOfServicesPage } from '../../pages/terms-of-services/terms-of-services';
import { VersionInfoPage } from '../../pages/version-info/version-info';
import { PrivacyPolicyPage } from '../../pages/privacy-policy/privacy-policy';
import { AlertOptions } from 'ionic-angular/components/alert/alert-options';
/**
 * Generated class for the HeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {

  @Input() title: string;
  @Input() sub_title: string;
  @Input() button: string;
  
  @Input() scrollArea: any;

  public userProfile: any;
  public show: boolean;
  
  constructor(public storage: Storage , 
              public modalCtrl: ModalController,
              public navCtrl: NavController,
              public network: NetworkProvider,
              public studyStatus: StudyStatusProvider,
              public alertProvider:AlertProvider,
              public popoverCtrl: PopoverController,
              public menuCtrl: MenuController,
              public time: Time) {
    this.title = this.sub_title =  this.button = '';
    this.getProfile();
  }

  /* GETTING PROFILE INFO OF LOGGED IN USER */
  getProfile(){
    this.userProfile = {};
    this.show = false;
    this.storage.get('currentUser').then(user => {
      this.show = true;
      this.userProfile = user;
    });
    
  }
 
  /* GETTING PROFILE IMAGE */
  getProfileImage(){
    
    if(typeof this.userProfile.userimage !== 'undefined' && this.userProfile.userimage !== null && this.userProfile.userimage !== ''){
        
        let imagePath = '';
        
        if(this.network.isInternetAvailable()){
          if(this.userProfile.userimage.indexOf('assets/profile_images') > -1)
              imagePath = SERVER_URL + 'assets/profile_images/' + this.userProfile.userimage.split('/profile_images')[1];
          else
          imagePath = SERVER_URL +  this.userProfile.userimage;
        }
        else 
           imagePath = 'assets/images/person.jpg';
        
      return imagePath;

    }
    else
        return 'assets/images/person.jpg';
        
  }
 
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopOverPage);
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(data => {
       
        if(data.value == 'privacy_policy')
          this.navCtrl.push(PrivacyPolicyPage);
        else if(data.value == 'terms_of_services')
          this.navCtrl.push(TermsOfServicesPage);
        else  if(data.value == 'version_info')
        this.showVersion();
        else 
           console.error(ERROR);   
 
     });
   }
 
   showVersion(){
     let modal = this.modalCtrl.create('VersionInfoPage' , { },{ cssClass: 'inset-modal version-info-modal' });
     modal.onDidDismiss(data => {
      console.log('PROFILE PAGE MODAL DISMISSED.');  
     });
 
     modal.present();
   }

   getTitle(title: any){
      if(title == 'Select Area' || title == 'Select Element' || title == 'Select Role' || title == 'Enter Rating' || title == 'Add Rating' || title == 'Enter Frequency' || title == 'Study Data' || title == 'Round Summary')
        return true;
      else
        return false;
   }

  openMenu(){
    if(this.studyStatus.getStatus())
       this.cancelStudy();
    else
      this.menuCtrl.open();
   }

  cancelStudy() {
    let message = 'Are you sure that you want to cancel this Study ?'
    let title: 'Efficiency Study';
    this.alertProvider.presentConfirm(title,message).then(action => {
        if(action == 'yes'){
          //this.time.setStatus(true);
          this.time.destroyTimer();
          this.studyStatus.setStatus(false);
          this.navCtrl.popToRoot();
        }
        else
          console.log('User dont want to cancel the Study');  
    })
    .catch(error => {
      console.log("ERROR: " + error);
    });
  }

}
