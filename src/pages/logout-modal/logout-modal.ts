import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/index';
import { Storage } from "@ionic/storage";
import { SERVER_URL ,ERROR } from '../../config/config';
/**
 * Generated class for the LogoutModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logout-modal',
  templateUrl: 'logout-modal.html',
})
export class LogoutModalPage {

  public user: any;
  public show: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public authProvider: AuthProvider,
              public storage: Storage,
              public viewCtrl: ViewController) {
       this.initView();         
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutModalPage');
  }
  /* INITIALIZING THE ALERT ACCORDING TO PARAMETERS */
  initView() {
    this.show = false;
    this.user= {};
    this.storage.get('currentUser').then(user => {
      this.user = user;
      this.show = true;
    }).catch(error => console.error(ERROR));
  }

  /* DISMISSING ALERT */
  dismiss(action: string) {
    let data = { action: action };
    this.viewCtrl.dismiss(data);
  }

  getProfileImage() {

    if(typeof this.user.userimage !== 'undefined' && this.user.userimage !== null && this.user.userimage !== ''){
      let imagePath = SERVER_URL + 'assets/profile_images/' + this.user.userimage.split('/profile_images')[1];
      return imagePath;
  }
  else
      return 'assets/images/person.jpg';
  }

}
