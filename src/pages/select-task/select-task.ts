import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , MenuController} from 'ionic-angular';
import { Time , ParseDataProvider,  ToastProvider, FormBuilderProvider,
         AlertProvider ,LoaderProvider, OperationsProvider, SqlDbProvider, NetworkProvider } from '../../providers';
import { Selection } from '../../bases';
import { CreateTaskPage } from '../../pages/create-task/create-task';
import { SelectElementPage } from '../select-element/select-element';
/**
 * Generated class for the SelectTaskPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-task',
  templateUrl: 'select-task.html',
})
export class SelectTaskPage extends Selection {
  
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
    super(navCtrl, navParams ,time,parseData,loader,operations,sql,network,alert, formBuilder,menuCtrl,toast);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectTaskPage');
  }

  ionViewWillEnter(){
    this.time.destroyTimer();
    this.init('Tasks',this.navParams.get('project'), SelectElementPage);
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave SelectTaskPage');
    this.isFiltering = this.isSearching = false;
  }
}
