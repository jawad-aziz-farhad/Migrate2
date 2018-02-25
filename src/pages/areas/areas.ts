import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , MenuController } from 'ionic-angular';
import { AreaDetailPage } from '../area-detail/area-detail';
import { Time , ParseDataProvider, SearchProvider, ToastProvider, FormBuilderProvider,
         AlertProvider ,LoaderProvider, OperationsProvider, SqlDbProvider, NetworkProvider } from '../../providers';
import { MESSAGE , SERVER_URL , INTERNET_ERROR} from '../../config/config';
import { Selection } from '../../bases';
/**
 * Generated class for the AreasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-areas',
  templateUrl: 'areas.html',
})
export class AreasPage extends Selection {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public menuCtrl: MenuController,
              public operations: OperationsProvider,
              public loader: LoaderProvider,
              public sql: SqlDbProvider,
              public network: NetworkProvider,
              public toast: ToastProvider,
              public time: Time,
              public parseData: ParseDataProvider,
              public search: SearchProvider,
              public alert: AlertProvider,
              public formBuilder: FormBuilderProvider,
              ) {
      super(navCtrl,time,parseData,search,loader,operations,sql,network,alert,formBuilder,menuCtrl,toast);         
      this.initView();         
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AreasPage');
  }

  initView(){
    this.init('Locations','Locations_IDs',this.navParams.get('project'), AreaDetailPage);
  }

  /*  */
  getImage(){
    if(this.project.logo)
      return SERVER_URL + this.project.logo;
    else
      return 'assets/images/logo.png';  
  }

  /* GOING TO SELECTED LOCATION TO VIEW MORE DETAILS ABOUT SELECTED LOCATION */
  gotoDetail(location){
    this.navCtrl.push(AreaDetailPage, { location: location, project: this.project }); 
  }

}
