import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { RatingsPage } from '../ratings/ratings';
import { Time , ParseDataProvider, ToastProvider, LoaderProvider, FormBuilderProvider,
         OperationsProvider, SqlDbProvider, NetworkProvider , AlertProvider, ParserProvider } from '../../providers';
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
              parser: ParserProvider,
              loader: LoaderProvider,
              operations: OperationsProvider,
              sql: SqlDbProvider,
              network: NetworkProvider,
              alert: AlertProvider,
              formBuilder: FormBuilderProvider,
              menuCtrl: MenuController,
              toast: ToastProvider) {
    super(navCtrl,navParams,time,parseData,parser,loader,operations,sql,network,alert, formBuilder,menuCtrl,toast);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectAerPage');
  }

  ionViewWillEnter(){
    this.init('Elements',this.navParams.get('task'), RatingsPage);
 }

}
