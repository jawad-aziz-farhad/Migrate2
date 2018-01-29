import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the VersionInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-version-info',
  templateUrl: 'version-info.html',
})
export class VersionInfoPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VersionInfoPage');
  } 

  /* DISMISSING THE INFORMATION ALERT */
  dismiss(){
      this.viewCtrl.dismiss();
  }

}
