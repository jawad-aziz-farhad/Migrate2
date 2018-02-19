import { IonicPage, NavController, Platform , NavParams , MenuController} from 'ionic-angular';
import { Time , ParseDataProvider, SearchProvider, ToastProvider, FormBuilderProvider, TimerService,
         AlertProvider ,LoaderProvider, OperationsProvider, SqlDbProvider, NetworkProvider, StudyStatusProvider } from '../providers';

export interface AER {
    navCtrl: NavController,  
    navParams: NavParams,
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
    toast: ToastProvider
}