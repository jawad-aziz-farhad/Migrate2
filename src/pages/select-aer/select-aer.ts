import { Component , ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform , NavParams , MenuController} from 'ionic-angular';
import { TimerComponent } from '../../components/timer/timer';
import { SelectAreaPage } from '../select-area/select-area';
import { CreateRolePage } from '../create-role/create-role';
import { Time , ParseDataProvider, SearchProvider, ToastProvider, FormBuilderProvider, TimerService,
         AlertProvider ,LoaderProvider, OperationsProvider, SqlDbProvider, NetworkProvider, StudyStatusProvider } from '../../providers';
import { ERROR , MESSAGE, INTERNET_ERROR , STUDY_START_TOAST, ALERT_TITLE, STUDY_CANCELING_MESSAGE, NO_DATA_FOUND } from '../../config/config';
import { Role, DummyData , StudyData } from '../../models';
import { Observable } from "rxjs";
import { FormBuilder } from '@angular/forms/src/form_builder';
import { Data } from '../../bases/data';

/**
 * Generated class for the SelectAerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-aer',
  templateUrl: 'select-aer.html',
})
export class SelectAerPage extends Data {

  
  constructor(navCtrl: NavController,  
              protected navParams: NavParams,
              time: Time ,
              parseData: ParseDataProvider,
              search: SearchProvider,
              loader: LoaderProvider,
              operations: OperationsProvider,
              sql: SqlDbProvider,
              network: NetworkProvider,
              studyStatus: StudyStatusProvider,
              alert: AlertProvider,
              formBuilder: FormBuilderProvider,
              menuCtrl: MenuController,
              toast: ToastProvider) {
    super(navCtrl,time,parseData,search,loader,operations,sql,network,studyStatus,alert, formBuilder,menuCtrl,toast);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectAerPage');
  }

  ionViewWillEnter(){
    this.init('Elements','Elements_IDs',this.navParams.get('project'), SelectAreaPage);
  }

}
