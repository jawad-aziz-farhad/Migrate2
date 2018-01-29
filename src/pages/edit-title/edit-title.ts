import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController} from 'ionic-angular';
import { ParserProvider } from '../../providers';
/**
 * Generated class for the EditTitlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-title',
  templateUrl: 'edit-title.html',
})
export class EditTitlePage {

  public studyTitle: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public parser: ParserProvider) {
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad EditTitlePage');
  }

  ionViewWillEnter(){
    this.studyTitle = this.navParams.get('title');
  }

  dismiss(value: string){
    var parser = this.parser.geAllData();
    parser.setTitle(this.studyTitle);
    this.viewCtrl.dismiss();
  }

}
