import { IonicPage, NavController, Platform , NavParams , MenuController} from 'ionic-angular';
import { Time , ParseDataProvider, SearchProvider, ToastProvider, FormBuilderProvider,
         AlertProvider ,LoaderProvider, OperationsProvider, SqlDbProvider, NetworkProvider } from '../providers';

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
    alert: AlertProvider,
    formBuilder: FormBuilderProvider,
    menuCtrl: MenuController,
    toast: ToastProvider
}