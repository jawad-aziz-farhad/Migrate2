import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController , ModalController} from 'ionic-angular';
import { SERVER_URL } from '../../config/config';
import { AuthProvider } from '../../providers/auth/auth';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public user: any;
  public show: boolean;
  public isLogoutClicked: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public modalCtrl: ModalController,
              public authProvider: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.isLogoutClicked = false;
    this.show = false;
    this.initView();
  }

  /* INITIALIZING THE ALERT ACCORDING TO PARAMETERS */
  initView() {
    this.user = this.navParams.get('user');
    this.show = true;
    console.log('USER INFO' + JSON.stringify(this.user));
  }
  
  /* GETTING PROFILE IMAGE */
  getProfileImage(){
    
    if(typeof this.user.userimage !== 'undefined' && this.user.userimage !== null && this.user.userimage !== ''){
        let imagePath = SERVER_URL + 'assets/profile_images/' + this.user.userimage.split('/profile_images')[1];
        return imagePath;
    }
    else
        return 'assets/images/person.jpg';
  }
  /* DISMISSING DIALOG */
  dismiss(){
    this.viewCtrl.dismiss();
  }
  
  /* LOGGING OUT */
  logout() {
    this.dismiss();
    this.authProvider.logOut();
  }

}
