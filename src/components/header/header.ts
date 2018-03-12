import { Component , Input } from '@angular/core';
import { ModalController, NavController, MenuController } from 'ionic-angular';
import { SERVER_URL, ERROR } from '../../config/config';
import { NetworkProvider , AlertProvider , Time} from '../../providers';
import { PopoverController } from 'ionic-angular';
import { PopOverPage } from '../../pages/pop-over/pop-over';
import { TermsOfServicesPage } from '../../pages/terms-of-services/terms-of-services';
import { PrivacyPolicyPage } from '../../pages/privacy-policy/privacy-policy';
import { Storage } from '@ionic/storage';
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
    
    if(this.userProfile.userimage){
        
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
  
  openMenu(){
   this.menuCtrl.open();
  }
  
}
