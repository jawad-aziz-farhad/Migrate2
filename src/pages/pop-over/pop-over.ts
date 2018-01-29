import { Component , } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController  } from 'ionic-angular';
import { ViewContainerData } from '@angular/core/src/view';

/**
 * Generated class for the PopOverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pop-over',
  templateUrl: 'pop-over.html',
})
export class PopOverPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopOverPage');
  }

  close(value: any) {
    var data = { value: value };
    this.viewCtrl.dismiss(data);
  }

}
