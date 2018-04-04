import { Component  } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Time , ParseDataProvider, ToastProvider, LoaderProvider, FormBuilderProvider,
        OperationsProvider, SqlDbProvider, NetworkProvider , AlertProvider } from '../../providers';
import { Selection } from '../../bases';
import { SelectTaskPage } from '../select-task/select-task';
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
    super(navCtrl,navParams, time,parseData,loader,operations,sql,network,alert, formBuilder,menuCtrl,toast);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectAerPage');
  }

  ionViewWillEnter(){
    this.init('Areas', this.navParams.get('project'), SelectTaskPage);
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave SelectAerPage');
    this.isFiltering = this.isSearching = false;
  }

}
