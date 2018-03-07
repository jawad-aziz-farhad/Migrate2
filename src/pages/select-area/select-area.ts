import { Component , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { SelectElementPage } from '../select-element/select-element';
import { Time , ParseDataProvider, SearchProvider, ToastProvider, LoaderProvider, FormBuilderProvider,
        OperationsProvider, SqlDbProvider, NetworkProvider , AlertProvider} from '../../providers';
import { CreateAreaPage } from '../create-area/create-area';
import { Selection } from '../../bases';
/**
 * Generated class for the SelectAreaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-area',
  templateUrl: 'select-area.html',
})
 export class SelectAreaPage extends Selection {
  
  constructor(navCtrl: NavController,  
              public navParams: NavParams,
              time: Time ,
              parseData: ParseDataProvider,
              search: SearchProvider,
              loader: LoaderProvider,
              operations: OperationsProvider,
              sql: SqlDbProvider,
              network: NetworkProvider,
              alert: AlertProvider,
              formBuilder: FormBuilderProvider,
              menuCtrl: MenuController,
              toast: ToastProvider) {
    super(navCtrl,time,parseData,search,loader,operations,sql,network,alert, formBuilder,menuCtrl,toast);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectAerPage');
  }

  ionViewWillEnter(){
    this.init('Areas', this.navParams.get('project'), SelectElementPage);
 }

}
