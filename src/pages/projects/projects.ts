import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams  } from 'ionic-angular';
import { AuthProvider , OperationsProvider , ToastProvider, LoaderProvider, SqlDbProvider, NetworkProvider, FormBuilderProvider , HeadersProvider} from '../../providers/index';
import { SERVER_URL, MESSAGE , INTERNET_ERROR, NO_DATA_FOUND} from '../../config/config';
import { Storage } from "@ionic/storage";
import { AreasPage } from '../areas/areas';
import { Projects, IDs } from '../../models';
import { importExpr } from '@angular/compiler/src/output/output_ast';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms/src/form_builder';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { forkJoin } from "rxjs/observable/forkJoin";
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
  private TABLE_NAME_4:string = 'Roles';
  private TABLE_NAME_5:string = 'Areas';
  private TABLE_NAME_6:string = 'Elements';
  private TABLE_NAME_7: string = 'Locations';
  private all_data: Array<any> = [];
  
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
    this.show = false;
    this.projects = [];
    const endPoint = this.TABLE_NAME +  '/getByManagerEmail/' + this.userProfile.email;
    this.operations.getByEmail(endPoint).subscribe(res => {
      console.log(res.result.length + '\n' +JSON.stringify(res));
      this.projects = res.result;
      if(res.result.length > 0) 
        this.createTable(res, this.TABLE_NAME);
      else
        this.toast.showBottomToast(NO_DATA_FOUND);  
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
          this.createTable(data,this.TABLE_NAME_4);  
        else if(table == this.TABLE_NAME_4)
          this.createTable(data,this.TABLE_NAME_5);
        else if(table == this.TABLE_NAME_5)
          this.createTable(data,this.TABLE_NAME_6);  
        else if(table == this.TABLE_NAME_6)
          this.createTable(data,this.TABLE_NAME_7);  
        else if(table == this.TABLE_NAME_7)
          this.insertData(data.result, this.TABLE_NAME);
      });
  }
  
  /* INSERTING DATA TO TABLE */
  insertData(data, table) {
    this.sql.addData(table,data).then(result => {
      if(table == this.TABLE_NAME)
        this.insertIDs(data, this.TABLE_NAME_1);
      else{
        if(table == this.TABLE_NAME_4)
          this.insertData(this.all_data[1],this.TABLE_NAME_5);
        else if(table == this.TABLE_NAME_5)
          this.insertData(this.all_data[2],this.TABLE_NAME_6);
        else if(table == this.TABLE_NAME_6)
          this.insertData(this.all_data[3],this.TABLE_NAME_7);
        else 
            this.getAllData();  
      }  
    }).catch(error => {
        console.error("ERROR: " + JSON.stringify(error));
    });
  }

  /* INSERTING IDS OF EACH PROJECT TO GET DATA ACCORDINGLY IN FUTURE */
  insertIDs(data, table) {
    this.sql.addingIDs(table,data).then(result => {
      if(table == this.TABLE_NAME_1)
        this.insertIDs(data,this.TABLE_NAME_2);
      else if(table == this.TABLE_NAME_2)    
        this.insertIDs(data,this.TABLE_NAME_3);
      else if(table == this.TABLE_NAME_3)
        this.getDatabyElements(data, this.TABLE_NAME_4);
    }).catch(error => {
        console.error("ERROR: " + JSON.stringify(error));
    });
  
  }

  getDatabyElements(data,table){
    this.makeRequest(table, data).subscribe(result => {
      this.insertMultipleData(result);
    },
    error => console.log(JSON.stringify(error)),
    () => console.log('DONE.')
    );
  }
  /* INSERTING DATA RETURNED BY MULTIPLE FORK JOINS AND MAPPING EACH INDEX TO GET DATA ACCORDINGLY,
    LIKE AT FIRST INDEX WE HAVE AN ARRAY WHICH ALSO AN ARRAY OF RESULT
    DATA IS RETURNED AS WE PASSED IN OUR HTTP REQUESTS
    AT O INDEX: ROLES
    AT 1 INDEX: AREAS
    AT 2 INDEX: ELEMENTS 
  */
  insertMultipleData(data){  
    let roles = [];let elements = []; let areas = []; let locations = [];
    data.forEach((element, index) => {
      element.forEach((sub_element, sub_index) => {
          if(sub_element.result.length > 0){
            sub_element.result.forEach((res_element, res_index) => {
                res_element.project_id = this.projects[index]._id;
                res_element.customer_id = this.projects[index].customer._id;
                if(sub_index == 0)
                  roles.push(res_element);
                else if(sub_index == 1)
                  areas.push(res_element);
                else if(sub_index == 2)
                  elements.push(res_element);    
                else if(sub_index == 3)
                 locations.push(res_element);  
            });
          }
      });
    });
    this.all_data = [];
    this.all_data[0] = roles;
    this.all_data[1] = areas;
    this.all_data[2] = elements;
    this.all_data[3] = locations
                
    this.insertData(this.all_data[0],this.TABLE_NAME_4);
  }
 
  /* MAKING MULTIPLE REQUESTS FOR EACH ARRAY INDEX */
  makeRequest(table, data): Observable<any> {
    let all_data = [];
    return new Observable(observer => {
      data.forEach((project, index) => {
        this.getForkJoin(project).subscribe(reslut => {
            all_data.push(reslut);
            if(index == data.length - 1)
              observer.next(all_data);
        });   
      });
    });
    
  }

  /* GETTING FORK JOIN FOR EACH INDEX , AS WE ARE HAVING ELEMENTS , ROLES, AREAS AT EACH INDEX 
    AND WE HAVE TO GET THEIR DETAILS SO FOR ONE INDEX, WE ARE MAKING ONE FOKJOIN AND GETTING DATA FROM 
    3 ENDPOINTS, IT WILL BE DONE FOR EACH INDEX OF PROJECTS ARRAY
   */
  getForkJoin(project): Observable<any> {          
    let formData = null;
    let request1 = null;
    let request2 = null;
    let request3 = null;
    let request4 = null;
    
    /* MAKING REQUEST FOR ROLES */
    this.formBuilder.initIDForm(project.roles);
    formData = this.formBuilder.getIDForm().value;
    request1 = this.getRequest('roles', formData);

    /* MAKING REQUEST FOR AREAS */
    this.formBuilder.initIDForm(project.areas);
    formData = this.formBuilder.getIDForm().value;
    request2 = this.getRequest('areas', formData);
    
    /* MAKING REQUEST FOR ELEMENTS */
    this.formBuilder.initIDForm(project.elements);
    formData = this.formBuilder.getIDForm().value;
    request3 = this.getRequest('elements', formData);

    request4 = this.getRequest('locations/getByCustomerId/', project.customer._id);
    let observablesArray = [request1, request2 , request3, request4];

    return Observable.forkJoin(observablesArray);
  } 

  /* MAKING SINGLE REQUEST FOR FORK JOIN */
  getRequest(endPoint, data): Observable<any>{
    if(endPoint.indexOf('locations/getByCustomerId') > -1 ){
      endPoint = SERVER_URL + endPoint + data ; 
      return this.http.get(`${endPoint}`).map(res => res.json());
     } 
    else{
      endPoint = SERVER_URL + endPoint + '/getByIds';
      return this.http.post(`${endPoint}`, data, {headers: this.headers.getHeaders()}).map(res => res.json());
    }
  }

  /* GETTING ALL DATA OF GIVEN TABLE */
  getAllData() {
      this.sql.getAllData(this.TABLE_NAME).then(data => {
        this.loader.hideLoader();
        this.populateData(data);
      }).catch(error => {
          console.error("ERROR: " + JSON.stringify(error));
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

  /* DROPPING ALL THE OBOVE SIX TABLES FROM DATA BASE */
  dropTable(refresher, table){
    this.sql.dropTable(table).then(result => {
      if(table == this.TABLE_NAME)    
        this.dropTable(refresher,this.TABLE_NAME_1);
      else if(table == this.TABLE_NAME_1)
        this.dropTable(refresher,this.TABLE_NAME_2);
      else if(table == this.TABLE_NAME_2)    
        this.dropTable(refresher,this.TABLE_NAME_3);
      else if(table == this.TABLE_NAME_3)    
        this.dropTable(refresher,this.TABLE_NAME_4);
      else if(table == this.TABLE_NAME_4)    
        this.dropTable(refresher,this.TABLE_NAME_5);
      else if(table == this.TABLE_NAME_5)    
        this.dropTable(refresher,this.TABLE_NAME_6);
      else if(table == this.TABLE_NAME_6)    
        this.dropTable(refresher,this.TABLE_NAME_7);
      else if(table == this.TABLE_NAME_7)    
        this.dropTable(refresher,'Create_Area');    
      else if(table == 'Create_Area')    
        this.dropTable(refresher,'Create_Role');  
      else if(table == 'Create_Role')    
        this.dropTable(refresher,'Create_Element');
     else if(table == 'Create_Element')    
        this.dropTable(refresher,'Study'); 
     else if(table == 'Study')    
        this.dropTable(refresher,'Study_Data');
      else if(table == 'Study_Data'){
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
