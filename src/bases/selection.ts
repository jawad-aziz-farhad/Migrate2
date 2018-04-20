
import { NavController, MenuController, NavParams } from 'ionic-angular';
import { ToastProvider, LoaderProvider, FormBuilderProvider, AlertProvider, ParseDataProvider,
         OperationsProvider, SqlDbProvider, NetworkProvider, Time} from '../providers';
import { MESSAGE, INTERNET_ERROR, NO_DATA_FOUND } from '../config/config';
import { Data } from '../models';
import { CreateAreaPage } from '../pages/create-area/create-area';
import { CreateElementPage } from '../pages/create-element/create-element';
import { CreateRolePage } from '../pages/create-role/create-role';
import { RatingsPage } from '../pages/ratings/ratings';
import { AddFrequencyPage } from '../pages/add-frequency/add-frequency';
import { Stop } from './stop-study';
import { Observable } from 'rxjs';
import { CreateTaskPage } from '../pages/create-task/create-task';
import { ActionButtons } from '../pages/actionbuttons/actionbuttons';


export class Selection {
  
  protected TABLE_NAME: string = '';
  protected TABLE_NAME_1: string = '';
  protected project: any;
  protected task: any;
  protected temp: any;
  protected _temp: any;
  protected isFiltering: boolean;
  protected isSearching: boolean;
  protected show: boolean;
  protected data: Array<any>;
  protected groupedData: Array<any>;
  protected nextComponent: any;
  protected searchInput: any;

  private stop: Stop;
  private elementIDs = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public time: Time ,
              public parseData: ParseDataProvider,
              public loader: LoaderProvider,
              public operations: OperationsProvider,
              public sql: SqlDbProvider,
              public network: NetworkProvider,
              public alert: AlertProvider,
              public formBuilder: FormBuilderProvider,
              public menuCtrl: MenuController,
              public toast: ToastProvider){
  }

  init(TABLE_NAME: string, project: any, nextComponent: any){
      this.searchInput = '';
      this.show = false;
      this.nextComponent = nextComponent;
      this.TABLE_NAME = TABLE_NAME;
      this.project = project;
      if(this.TABLE_NAME == 'Locations')
        this.pullTwotablesData();
      else
        this.pullSQLData();
  }

  /* PULLING TWO TABLES DATA AND SHOWING THOSE LOCATIONS WHICH ARE ASSIGNED TO CURRENT USER */
  pullTwotablesData(){

    const ids = this.sql.getIDData(this.TABLE_NAME_1, this.project._id);
    const data = this.sql.getIDData(this.TABLE_NAME, this.project._id);
    
    const array = [ids,data];

    Observable.forkJoin(array).subscribe(result => {

      const ids  = result [0];
      const data = result[1];

      this.data = [];

      if(data.length > 0) {
        data.forEach((element,index) => {
          if(ids.indexOf(element._id) > -1)
            this.data.push(element);
        });
      this.populateData(this.data);
    }
    else
      this.pullServerData();
    },
    error => console.error("TWO TABLES DATA ERROR: "+ JSON.stringify(error)));
  }

  /* PULLING SQLite DATA */
  pullSQLData(){
    let id = null;
    if(this.TABLE_NAME == 'Elements')
      id = this.task._id;
    else
      id = this.project._id;  
    const data = this.sql.getIDData(this.TABLE_NAME, id);
    data.then((result: any) => {
      if(result.length > 0)
        this.populateData(result);
      else{
        if(this.network.isInternetAvailable())
          this.pullServerData();  
        else
          this.toast.showBottomToast(INTERNET_ERROR);
      }
    }).catch(error => this.handleError(error));
  }           
 
  /* PULLING DATA FROM SERVER */
  pullServerData(){

    this.loader.showLoader(MESSAGE);
    this.data = this.groupedData = [];
    let endPoint = null; let data = null;
    
    
    /* SETTING END POINT AND DATA FOR TABLES OTHER THAN ELEMENTS */
    if(this.TABLE_NAME !== 'Elements'){
      data = { projectID: this.project._id };
      endPoint = this.TABLE_NAME.toLowerCase() + '/getByProjectID';
    }
    /* SETTING END POINT AND DATA FOR TABLE ELEMENTS */
    else{
      data = { taskID: this.task._id };
      endPoint = 'elements/getByTaskID';
    }
    
    const request = this.operations.postRequest(endPoint , data)
    
    request.subscribe(data => {   

      this.loader.hideLoader();
      if(data.result)
        data = data.result;
     
      if(data.length > 0){
        data.forEach((element,index) => {
          if(this.TABLE_NAME == 'Elements')
            element.taskID = this.task._id;  
          else
            element.projectID = this.project._id;  
        });
        
        this.createTable(data);
      }
      else
        this.toast.showBottomToast(NO_DATA_FOUND);
    },
    error => {
      this.loader.hideLoader();
      this.operations.handleError(error);
    });
  }

  /* CREATIN TABLE */
  createTable(data){
    const create = this.sql.createTable(this.TABLE_NAME);
    create.then(result => this.saveData(data))
          .catch(error => this.handleError(error));
  }

  /* SAVING DATA LOCALLY */
  saveData(data){
    const save = this.sql.addData(this.TABLE_NAME, data);
    save.then(result => this.pullSQLData())
        .catch(error =>  this.handleError(error));
  }


 /* POPULATING DATA */
  populateData(data){
    this.data = [];
    this._temp = {};
    this.data = data;
    this.temp = data;
    this.show = true;
  }

  /* SELECTED ELEMENT FOR STUDY */
  selectItem(item){
    this._temp = item;
    this._parseData(item);
  }

  /* PARSING STUDY DATA */
  _parseData(item: any){

    if(this.TABLE_NAME == 'Elements' || this.TABLE_NAME == 'Tasks'){
      let data = null;
     
      if(this.parseData.getData())
        data = this.parseData.getData();
      else
        data = new Data();

      if(this.TABLE_NAME == 'Elements')
        data.setElement(item); 
      else if(this.TABLE_NAME == 'Tasks'){
        data.setStartTime(new Date().getTime());
        data.setTask(item);
      }

      this.parseData.setData(data);
    }
    else{
      let study_data = this.parseData.getStudyData();   
     
      if(this.TABLE_NAME == 'Areas')
        study_data.setArea(item);
      else if(this.TABLE_NAME == 'Roles'){
        study_data.setRole(item);
      }
      
      this.parseData.setStudyData(study_data);
    }

    this.goNext();
  }

  /* GOING TO THE NEXT PAGE */
  goNext() {
    
    if(this.TABLE_NAME == 'Elements') {      
      console.log("\nELEMENT RATING: "+ this._temp.rating + "\nPROJECT RATING: "+ this.project.rating)
      if(this.project.rating == 2 || this._temp.rating == 1 || this._temp.rating == 2){
        let rating = null
        /* IF SELECTED ELEMENT HAS RATING OF 1 */
        if(this._temp.rating == 1)
          rating = 'Not Rated';
        /* IF SELECTED ELEMENT OR PROJECT HAS RATING 2 */
        else
          rating = 100;

        let data = this.parseData.getData();
        data.setRating(rating);

        if(this._temp.count == 2){
          data.setFrequency(1);
          this.nextComponent = ActionButtons;
        }
        else
          this.nextComponent = AddFrequencyPage;
        
          this.parseData.setData(data);
      }

      else
        this.nextComponent =  RatingsPage ;

      this.time.runTimer();  
    }

    this.isSearching = false;
    let data = null;
    if(this.TABLE_NAME == 'Tasks')
      data = {task: this.parseData.getData().getTask() , project: this.project };
    else if(this.TABLE_NAME == 'Elements')
      data = {project: this.project, elements: this.data }  
    else
      data = { project: this.project };
    this.navCtrl.push(this.nextComponent, data);
  }

  /* GIVING A STYLE TO SELECTED LIST ITEM */
  getStyle(item){
    if(this._temp._id == item._id)
      return 'list-checked';
    else
      return 'disabled';  
  }

  handleError(error){
    if(error.code && error.code == 5)
      this.pullServerData();
    console.error('ERROR: ' + error);
  }

  /* ON SEARCH CANCEL, SETTING THE ORIGINAL DATA BACK TO ARRAY  */
  onSearchCancel() : any {
    this.isSearching = false;
    this.data = this.temp;
  }

  /* REFRESHING DATA ON SWIPE DOWN */
  doRefresh(refresher) {
    /* IF INTERNET IS NOT AVAILABLE */
    if(!this.network.isInternetAvailable()) {
      this.toast.showToast(INTERNET_ERROR);
      refresher.complete();
      return;
    }
    
    this.dropTable(refresher);
    
  }

  /* DROPPING TABLE FROM DATA BASE */
  dropTable(refresher){
    this.data = [];
    this.sql.dropTable(this.TABLE_NAME).then(result => {
      if(refresher != '')
        refresher.complete();
      this.pullServerData();
    }).catch(error => this.handleError(error));
  }
  
  /* CANCELLING STUDY */ 
  cancelStudy() {
    this.stop = new Stop(this.navCtrl,this.alert, this.parseData,this.time);
    this.stop.studyEndConfirmation();
  }

  /* NAVIGATING TO CREATE ROLE PAGE FOR CREATING A NEW ROLE */
  createItem(event){
    let component = null;
    if(this.TABLE_NAME == 'Areas')
      component = CreateAreaPage;
    else if(this.TABLE_NAME == 'Elements')
      component = CreateElementPage
    else if(this.TABLE_NAME == 'Roles')
      component = CreateRolePage;
    else if(this.TABLE_NAME == 'Tasks')
      component = CreateTaskPage;  
    
    this.navCtrl.push(component, {project: this.project, data: this.temp });
  }

  is_Filtering(){
    this.isSearching = false;
    this.isFiltering = !this.isFiltering;
  } 
}