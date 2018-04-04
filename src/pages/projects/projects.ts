import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams  } from 'ionic-angular';
import { AuthProvider , OperationsProvider , ToastProvider, LoaderProvider, SqlDbProvider, NetworkProvider, FormBuilderProvider , HeadersProvider} from '../../providers/index';
import { MESSAGE , INTERNET_ERROR, NO_DATA_FOUND, ERROR, SERVER_URL} from '../../config/config';
import { Storage } from "@ionic/storage";
import { AreasPage } from '../areas/areas';
import { Projects } from '../../models';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
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

  public  TABLE_NAME: string   = 'Projects';

  private TABLE_NAME_1:string = 'Areas';
  private TABLE_NAME_2:string = 'Elements';
  private TABLE_NAME_3:string = 'Roles';
  private TABLE_NAME_4: string = 'Locations';
  private TABLE_NAME_5: string = 'assignedLocations';
  private TABLE_NAME_6: string = 'Categories';
  private TABLE_NAME_7: string = 'Tasks';
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams ,
              public operations: OperationsProvider,
              public loader: LoaderProvider,
              public authProvider: AuthProvider,
              public sql: SqlDbProvider,
              public toast: ToastProvider,
              public network: NetworkProvider,
              public formBuilder: FormBuilderProvider,
              public headers: HeadersProvider,
              public storage: Storage,
              public http: Http) {
               
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectsPage.');
  }

  ionViewWillEnter() {
    this.imagePath = "assets/images/logo.png"
    this.show = false;
    this.checkDB();
  }

  /* CHECKING LOCAL DATA BASE IF PROJECTS ARE ALREADY THERE OR NOT */
  checkDB(){
    this.sql.getDatabaseState().subscribe(ready  => {        
      if(ready)
        this.sql.getAllData(this.TABLE_NAME).then(result => {
          
          if(result.length == 0){
            if(!this.network.isInternetAvailable())
              this.toast.showToast(INTERNET_ERROR);
            else
              this.getData();
          }
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
    this.show = false;
    this.projects = [];
    this.operations.getdata().subscribe((res: any) => {
      console.log("\n\nPROJECTS DATA: "+ JSON.stringify(res))
      this.projects = res;
      if(res.length > 0) 
        this.createTable(res, this.TABLE_NAME);
      else{
        this.loader.hideLoader();
        this.toast.showBottomToast(NO_DATA_FOUND);
      }  
    },
    error => {
      this.loader.hideLoader();
      this.operations.handleError(error);
    });
  }

  /* CREATING TABLE TO SAVE TO LOCAL DATA BASE */
  createTable(data, table) {
    
    const table1 = this.sql.createTable(this.TABLE_NAME);
    const table2 = this.sql.createTable(this.TABLE_NAME_1);
    const table3 = this.sql.createTable(this.TABLE_NAME_2);
    const table4 = this.sql.createTable(this.TABLE_NAME_3);
    const table5 = this.sql.createTable(this.TABLE_NAME_4);
    const table6 = this.sql.createTable(this.TABLE_NAME_5);
    const table7 = this.sql.createTable(this.TABLE_NAME_6);
    const table8 = this.sql.createTable(this.TABLE_NAME_7);

    const tables = [ table1, table2, table3, table4, table5, table6, table7, table8 ];

    const create = Observable.forkJoin(tables);

    create.subscribe(result => {
      this.insertData(data);
    },
    error =>  this.loader.hideLoader(),
    () => console.log('DONE'));
  }

  /* INSERTING DATA TO TABLES */
  insertData(projects) {
    this.inserting(projects).subscribe(result => {
      this.getAllData();
    },
    error =>  this.loader.hideLoader(),
    () => console.log('DONE'));;
  }

  /* ITERARING THROUGH PROJECTS ARRAY AND SAVING DATA TO SQLITE TABLES */
  inserting(projects){
    return new Observable(observer => {
      projects.forEach((project,index) => {
        localStorage.setItem("projectID",project._id);
        this.forkJoin(project).subscribe(result => {
          if(index == (projects.length -1)){
            this.sql.addData(this.TABLE_NAME_6, projects[0].categories).then(res => {
              observer.next(true);
            }).catch(error => {
              console.error(error);
              this.loader.hideLoader();
            });
          }
        });
      });
    });
  }

  /* FOR EACH INDEX CREATING FORK JOIN OBSERVABLE */
  forkJoin(data): Observable<any> {

    let observablesArray = [];let _data = [];
    _data.push(data);
    const projects = this.sql.addData(this.TABLE_NAME,_data);
    const areas = this.sql.addData(this.TABLE_NAME_1,data.areas_data);
    const elements = this.sql.addData(this.TABLE_NAME_2,data.elements_data);
    const roles = this.sql.addData(this.TABLE_NAME_3,data.roles_data);
    const tasks = this.sql.addData(this.TABLE_NAME_7, data.tasks_data);
    const locations = this.sql.addData(this.TABLE_NAME_4,data.customer_locations);

    let assignedLocations = null
    data.fieldUsers.forEach((element,index) => {
      if(element._id == localStorage.getItem("userID"))
      assignedLocations = this.sql.addData(this.TABLE_NAME_5, element.locations);
    });

    observablesArray.push(areas,elements,roles,tasks,locations,projects,assignedLocations);

    return Observable.forkJoin(observablesArray);

  }

  /* GETTING ALL DATA OF GIVEN TABLE */
  getAllData() {
    this.sql.getAllData(this.TABLE_NAME).then(data => {
      this.loader.hideLoader();
      this.populateData(data);
    }).catch(error => {
        this.loader.hideLoader();
        this.toast.showBottomToast(NO_DATA_FOUND);
    });
  }

  /* POPULATING DATA */
  populateData(data){
    this.projects = data;
    this.show = true;
  }

  /* GETTING CUSTOMER IMAGE */
  getCustomerImage(image) {
    if(image && this.network.isInternetAvailable())       
      return SERVER_URL + image;  
    else 
      return this.imagePath;   
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
    this.dropTable(refresher);
}

  /* DROPPING ALL THE OBOVE SIX TABLES FROM DATA BASE */
  dropTable(refresher){

    const table1 = this.sql.dropTable(this.TABLE_NAME);
    const table2 = this.sql.dropTable(this.TABLE_NAME_1);
    const table3 = this.sql.dropTable(this.TABLE_NAME_2);
    const table4 = this.sql.dropTable(this.TABLE_NAME_3);
    const table5 = this.sql.dropTable(this.TABLE_NAME_4);
    const table6 = this.sql.dropTable(this.TABLE_NAME_5);
    const table7 = this.sql.dropTable(this.TABLE_NAME_6);
    const table8 = this.sql.dropTable(this.TABLE_NAME_7);

    const tables = [table1, table2, table3, table4, table5, table6, table7, table8]

    const drop = Observable.forkJoin(tables);

    drop.subscribe(result => {
       this.getData();
    }, 
    error => console.error(ERROR),
    () => { 
        if(refresher !== '')
          refresher.complete();
     });
  }

}
