import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { RatingsPage } from '../ratings/ratings';
import { Time , ParseDataProvider, ToastProvider, LoaderProvider, FormBuilderProvider,
         OperationsProvider, SqlDbProvider, NetworkProvider , AlertProvider } from '../../providers';
import { Selection } from '../../bases';
/**
 * Generated class for the SelectElementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-select-element',
  templateUrl: 'select-element.html',
})
export class SelectElementPage extends Selection  {
  
  constructor(navCtrl: NavController,  
              navParams: NavParams,
              time: Time ,
              parseData: ParseDataProvider,
              loader: LoaderProvider,
              operations: OperationsProvider,
              sql: SqlDbProvider,
              network: NetworkProvider,
              alert: AlertProvider,
              formBuilder: FormBuilderProvider,
              menuCtrl: MenuController,
              toast: ToastProvider) {
    super(navCtrl,navParams,time,parseData,loader,operations,sql,network,alert, formBuilder,menuCtrl,toast);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectElementPage');
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter SelectElementPage');
    this.task = this.navParams.get('task');
    this.init('Elements',this.navParams.get('project'), RatingsPage);
 }

 ionViewDidLeave() {
  console.log('ionViewDidLeave SelectElementPage');
  this.isFiltering = this.isSearching = false;
}

}
