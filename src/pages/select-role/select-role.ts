import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , MenuController} from 'ionic-angular';
import { SelectAreaPage } from '../select-area/select-area';
import { Time , ParseDataProvider,  ToastProvider, FormBuilderProvider,
         AlertProvider ,LoaderProvider, OperationsProvider, SqlDbProvider, NetworkProvider } from '../../providers';
import { Selection } from '../../bases';
/**
 * Generated class for the SelectRolePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-role',
  templateUrl: 'select-role.html',
})
export class SelectRolePage extends Selection {
  
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
    console.log('ionViewDidLoad SelectRolePage');
  }

  ionViewWillEnter(){
    this.time.destroyTimer();
    this.init('Roles',this.navParams.get('project'), SelectAreaPage);
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave SelectRolePage');
    this.isFiltering = this.isSearching = false;
  }
  
}
