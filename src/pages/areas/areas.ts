import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AreaDetailPage } from '../area-detail/area-detail';
import { OperationsProvider , LoaderProvider , SqlDbProvider , NetworkProvider, ToastProvider } from '../../providers/index';
import { MESSAGE , SERVER_URL , INTERNET_ERROR} from '../../config/config';

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
export class AreasPage {

  public project: any;
  public locations: Array<any> = [];
  public show: boolean;
  public TABLE_NAME = 'Locations';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public operations: OperationsProvider,
              public loader: LoaderProvider,
              public sql: SqlDbProvider,
              public network: NetworkProvider,
              public toast: ToastProvider) {
      this.initView();         
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AreasPage');
  }

  initView(){
    this.show = false;
    this.project = this.navParams.get('project');
    console.log(JSON.stringify(this.project));
    this.checkDB();
  }

  /* CHECKING LOCAL DATA BASE IF ROLES ARE ALREADY THERE OR NOT */
  checkDB(){
    this.sql.getDatabaseState().subscribe(ready  => {        
      if(ready)
        this.sql.getAllData(this.TABLE_NAME).then(result => {
            if(result.length == 0 || typeof result == 'undefined' || result == null)
              this.getData();
            else
              this.populateData(result);

        }).catch(error => {
            console.error('ERROR: ' + JSON.stringify(error));
        });
    });
  }
  
  /* GETTING DATA FROM SERVER */
  getData() {
    this.loader.showLoader(MESSAGE);
    this.operations.getLocationsByCustomerID('locations/getByCustomerId/', this.project.customer_id).subscribe(res => {
       console.log('LOCATIONS:\n' +JSON.stringify(res));
       this.createTable(res);
    },
    error => {
      this.loader.hideLoader();
      this.show = true;
      console.error('ERROR: ' + JSON.stringify(error));
    });
  }

/* CREATING TABLE TO SAVE TO LOCAL DATA BASE */
createTable(data) {
    this.sql.createTable(this.TABLE_NAME).then(res => {
        this.insertData(data);
    });
}

/* INSERTING DATA TO TABLE */
insertData(data) {
  this.sql.addData(this.TABLE_NAME,data.result).then(result => {
      this.getAllData();
  }).catch(error => {
      console.error("ERROR: " + JSON.stringify(error));
  });
}

/* GETTING ALL DATA OF GIVEN TABLE */
getAllData() {
    this.sql.getAllData(this.TABLE_NAME).then(data => {
      console.log('SQL DATA: ' + JSON.stringify(data))
      this.loader.hideLoader();
      this.populateData(data);
    }).catch(error => {
      this.loader.hideLoader();
      console.error("ERROR: " + JSON.stringify(error));
    })
}
checkValue(location: any){
  
  if(typeof location.locationname !== 'undefined' && location.locationname !== '' && location.locationname !== null)
    return true;
  else
    return false;

}
/* POPULATING DATA */
  populateData(locations){
    this.locations = [];
    this.locations = locations;
    this.show = true;
  }

/* DETAIL OF SELECTED LOCATION */
gotoDetail(location){
  this.navCtrl.push(AreaDetailPage, { location: location, project: this.project }); 
}

/* GETTING BRAND LOGO */
getImage(){
  if(typeof this.project.logo !== 'undefined' && this.project.logo !== null && this.project.logo !== '')
    return SERVER_URL + this.project.logo;
  else
    return 'assets/images/logo.png';  
}

  /* REFRESHING DATA ON SWIPE DOWN */
  doRefresh(refresher){
    /* IF INTERNET IS NOT AVAILABLE */
    if(!this.network.isInternetAvailable()){
     this.toast.showToast(INTERNET_ERROR);
     refresher.complete();
     return;
   }
   this.sql.isDataAvailable(this.TABLE_NAME).then(result => {
       if(result)
          this.dropTable(refresher);
       else
           refresher.complete();
 }).catch(error => {
   refresher.complete();
   console.error('ERROR: ' + JSON.stringify(error));
 });
}

 /* DROPPING TABLE FROM DATA BASE */
 dropTable(refresher){
   this.sql.dropTable(this.TABLE_NAME).then(result => {
      refresher.complete();
      this.getData();
   }).catch(error => {
      refresher.complete();
      console.error('ERROR: ' + JSON.stringify(error));
   });
 }
}
