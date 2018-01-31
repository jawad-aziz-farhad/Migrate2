import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,  } from 'ionic-angular';
import { AuthProvider , OperationsProvider , ToastProvider, LoaderProvider, SqlDbProvider, NetworkProvider } from '../../providers/index';
import { SERVER_URL, MESSAGE , INTERNET_ERROR} from '../../config/config';
import { Storage } from "@ionic/storage";
import { AreasPage } from '../areas/areas';
import { Projects, IDs } from '../../models';
import { importExpr } from '@angular/compiler/src/output/output_ast';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the ProjectsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
})
export class ProjectsPage {
  
  public projects: any;
  public title: string;
  public userProfile: any;
  public show: boolean;
  public imagePath: string;
  public dataArray: Array<Projects>;

  public  TABLE_NAME: string = 'Projects';
  private TABLE_NAME_1: string = 'Roles_IDs';
  private TABLE_NAME_2: string = 'Areas_IDs';
  private TABLE_NAME_3: string = 'Elements_IDs';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams ,
              public operations: OperationsProvider,
              public loader: LoaderProvider,
              public authProvider: AuthProvider,
              public sql: SqlDbProvider,
              public toast: ToastProvider,
              public network: NetworkProvider,
              public storage: Storage) {
               
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectsPage.');
  }

  ionViewWillEnter() {
    this.imagePath = "assets/images/logo.png"
    this.show = false;
    this.gettingData();
  }

  /* GETTING DATA */
  gettingData(){
    if(this.network.isInternetAvailable())
      this.dropTable('',this.TABLE_NAME);
    else  
      this.checkDB();   
  }
  

  /* CHECKING LOCAL DATA BASE IF PROJECTS ARE ALREADY THERE OR NOT */
  checkDB(){
      this.sql.getDatabaseState().subscribe(ready  => {        
        if(ready)
          this.sql.getAllData(this.TABLE_NAME).then(result => {
              if(result.length == 0 || typeof result == 'undefined' || result == null){
                if(!this.network.isInternetAvailable())
                  this.toast.showToast(INTERNET_ERROR);
                else
                  this.getProfile();
              }
              else
                this.populateData(result);

          }).catch(error => {
              console.error('ERROR: ' + JSON.stringify(error));
          });
      });
  }

  /* GETTING PROFILE INFO OF LOGGED IN USER */
  getProfile(){
    this.loader.showLoader(MESSAGE);
    this.userProfile = {};
    this.storage.get('currentUser').then(user => {
      this.userProfile = user;
      this.getData();
    });
    
  }

  
  /* GETTING DATA FROM SERVER */
  getData() {
    this.projects = [];
    const endPoint = this.TABLE_NAME +  '/getByManagerEmail/' + this.userProfile.email;
    this.operations.getByEmail(endPoint).subscribe(res => {
      console.log(JSON.stringify(res)) 
      this.createTable(res, this.TABLE_NAME);
    },
    error => {
      this.loader.hideLoader();
      console.error("ERROR: " + error);
    });
  }

  /* CREATING TABLE TO SAVE TO LOCAL DATA BASE */
  createTable(data, table) {      
    this.sql.createTable(table).then(res => {
        if(table == this.TABLE_NAME)
          this.createTable(data,this.TABLE_NAME_1);
        else if(table == this.TABLE_NAME_1)
          this.createTable(data,this.TABLE_NAME_2);
        else if(table == this.TABLE_NAME_2)
          this.createTable(data,this.TABLE_NAME_3);
        else if(table == this.TABLE_NAME_3)
          this.insertData(data.result, this.TABLE_NAME);
      });
  }
  
  /* INSERTING DATA TO TABLE */
  insertData(data, table) {
    this.sql.addData(table,data).then(result => {
      this.insertIDs(data, this.TABLE_NAME_1);
    }).catch(error => {
        console.error("ERROR: " + JSON.stringify(error));
    });
  }

  insertIDs(data, table) {
    this.sql.addingIDs(table,data).then(result => {
      if(table == this.TABLE_NAME_1)
        this.insertIDs(data,this.TABLE_NAME_2);
      else if(table == this.TABLE_NAME_2)    
        this.insertIDs(data,this.TABLE_NAME_3);
      else if(table == this.TABLE_NAME_3)
        this.getAllData(); 
    }).catch(error => {
        console.error("ERROR: " + JSON.stringify(error));
    });
  
  }

  /* GETTING ALL DATA OF GIVEN TABLE */
  getAllData() {
      this.sql.getAllData(this.TABLE_NAME).then(data => {
        this.loader.hideLoader();
        this.populateData(data);
      }).catch(error => {
          console.error("ERROR: " + JSON.stringify(error));
      })
  }

  /* POPULATING DATA */
  populateData(data){
    this.projects = data;
    this.show = true;
  }

  getCustomerImage(image) {

    let imagePath = '';
    
    if(typeof image !== 'undefined' && image !== null && image !== ''){
        
      if(this.network.isInternetAvailable()){
        imagePath = SERVER_URL + image;
      }
      else 
         imagePath = 'assets/images/person.jpg';
      
    return imagePath;

  }
  else
      return 'assets/images/logo.png';
  }
  
  /* GETTING LOCATIONS OF THIS PROJECT OR BRAND */
  gotoLocations(project: any): void{
    this.navCtrl.push(AreasPage, {project: project});
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
           this.dropTable(refresher, this.TABLE_NAME);
        else
            refresher.complete();
  }).catch(error => {
    refresher.complete();
    console.error('ERROR: ' + JSON.stringify(error));
  });
}

  /* DROPPING TABLE FROM DATA BASE */
  dropTable(refresher, table){
    this.sql.dropTable(table).then(result => {
      if(table == this.TABLE_NAME)    
        this.dropTable(refresher,this.TABLE_NAME_1);
      else if(table == this.TABLE_NAME_1)
        this.dropTable(refresher,this.TABLE_NAME_2);
      else if(table == this.TABLE_NAME_2)    
        this.dropTable(refresher,this.TABLE_NAME_3);
      else if(table == this.TABLE_NAME_3){
        if(refresher !== '')
          refresher.complete();
       this.getProfile();
      }
    }).catch(error => {
       refresher.complete();
       console.error('ERROR: ' + JSON.stringify(error));
    });
  }



}
