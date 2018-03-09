import { Component } from '@angular/core';
import { IonicPage , NavParams , ViewController } from 'ionic-angular';

/**
 * Generated class for the AlertModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alert-modal',
  templateUrl: 'alert-modal.html',
})
export class AlertModalPage {

    public error: string;
    public email: string;
    public title: string;
    
    constructor(public viewCtrl: ViewController,public params: NavParams) {
      this.initView();
    }

    /* INITIALIZING THE ALERT ACCORDING TO PARAMETERS */
    initView() {
      this.error = this.params.get('error');
      this.email = this.params.get('email');
     if(this.error == 'Wrong password')
        this.title = 'Invalid Password';
      else
        this.title = 'Invalid Account';  
    }

    /* DISMISSING ALERT */
    dismiss(action: string) {
      let data = { action: action};
      this.viewCtrl.dismiss(data);
    }
}
