
import { NavController, MenuController, NavParams } from 'ionic-angular';
import { ToastProvider, LoaderProvider, FormBuilderProvider, SearchProvider, AlertProvider, ParseDataProvider,
         OperationsProvider, SqlDbProvider, NetworkProvider, Time, ParserProvider} from '../providers';
import { MESSAGE, INTERNET_ERROR } from '../config/config';
import { StudyData } from '../models';
import { CreateAreaPage } from '../pages/create-area/create-area';
import { CreateElementPage } from '../pages/create-element/create-element';
import { CreateRolePage } from '../pages/create-role/create-role';
import { RatingsPage } from '../pages/ratings/ratings';
import { AddFrequencyPage } from '../pages/add-frequency/add-frequency';
import { Stop } from './stop-study';
import { Observable } from 'rxjs';


export class Selection {
  
  protected TABLE_NAME: string = '';
  protected TABLE_NAME_1: string = '';
  protected project: any;
  protected temp: any;
  protected _temp: any;
  protected isFiltering: boolean;
  protected show: boolean;
  protected data: Array<any>;
  protected groupedData: Array<any>;
  protected nextComponent: any;
  protected searchInput: any;

  private stop: Stop;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public time: Time ,
              public parseData: ParseDataProvider,
              public parser: ParserProvider,
              public search: SearchProvider,
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
    const data = this.sql.getIDData(this.TABLE_NAME,this.project._id);
    data.then((result: any) => {
      console.log("SQL DATA FOR "+ this.TABLE_NAME + " IS: "+ JSON.stringify(result))
      if(result.length > 0)
        this.populateData(result);
      else
        this.pullServerData();  
    }).catch(error => this.handleError(error));
     
  }           
 
  /* PULLING DATA FROM SERVER */
  pullServerData(){    
    this.loader.showLoader(MESSAGE);
    let endPoint = this.TABLE_NAME.toLowerCase() + '/getByProjectID';
    let data = { projectID: this.project._id};
    const request = this.operations.postRequest( endPoint , data)
    
    request.subscribe(data => {   

      console.log("SERVER DATA:  "+ JSON.stringify(data));
      this.loader.hideLoader();
      if(data.result)
        data = data.result;
     
      if(data.length > 0){
        data.forEach((element,index) => {
          element.projectID = this.project._id;  
        });
        
        this.createTable(data); 
      }
      else
        console.error("NO DATA FOUND.");
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
    if(this.TABLE_NAME !== 'Elements')
      this.show = true;
    else
      this.groupElementsData();  
  }

  /* CATEGORIZING ELEMENTS ACCORDING TO THEIR STUDY TYPE */
  groupElementsData(){

    // this.data.sort(function(a,b) {return (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0); });
    let data = this.data;
    data.sort(function(a,b) {return (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0); });
    let currentItems = [];
    let currentValue = false;
    this.groupedData = [];
    let studyTypes = [ null, 'Customer' ,'Task and Process' , 'NVA' ];

    data.forEach((element,index) => {

        if(currentValue != element.type) {

          currentValue = element.type;

          let newGroup = {
            letter: studyTypes[element.type],
            items: []
          };
          
          currentItems = newGroup.items;
          this.groupedData.push(newGroup);
        }
       
      currentItems.push(element);

    });
    
    console.log("\n\nGROUPED DATA: "+ JSON.stringify(this.groupedData));
    this.show = true;
  }


  /* SELECTED ELEMENT FOR STUDY */
  selectItem(item){
    this._temp = item;
    this._parseData(item);
  }

  /* PARSING STUDY DATA */
  _parseData(item: any){
     let study_data = null;
     if(!this.parseData.getData())
        study_data = new StudyData();
     else
        study_data = this.parseData.getData();   
     
    if(this.TABLE_NAME == 'Areas')
      study_data.setArea(item);
    else if(this.TABLE_NAME == 'Elements')
      study_data.setElement(item);
    else if(this.TABLE_NAME == 'Roles'){
      study_data.setRole(item);
      study_data.setObservationTime(new Date().getTime());
    }
    
    this.parseData.setData(study_data);
    this.goNext();
  }

  /* GOING TO THE NEXT PAGE */
  goNext() {
    
    if(this.TABLE_NAME == 'Elements'){

      if(this.project.rating == 2 || this._temp.rating == 1 || this._temp.rating == 2){
        let rating = null
        /* IF SELECTED ELEMENT HAS RATING OF 1 */
        if(this._temp.rating == 1)
          rating = 'Not Rated';
        /* IF SELECTED ELEMENT OR PROJECT HAS RATING 2 */
        else
          rating = 100;  
        this.parseData.getData().setRating(rating);
        this.parseData.setData(this.parseData.getData());
        this.nextComponent = AddFrequencyPage;
      }

      else
        this.nextComponent =  RatingsPage ;
    }
    
    this.navCtrl.push(this.nextComponent, { project: this.project});
  }

  /* GIVING A STYLE TO SELECTED LIST ITEM */
  getStyle(item){
    if(this._temp._id == item._id)
      return 'list-checked';
    else
      return 'disabled';  
  }

  handleError(error){
    //this.loader.hideLoader();
    if(error.code && error.code == 5)
      this.pullServerData();
    console.error('ERROR: ' + error);
  }

 /* WHEN USER TYPES TO SEARCH */ 
 onSearchInput(): any{
    if(this.searchInput)
      this.data = this.search.search_Item(this.data, this.searchInput);
    else
      this.data = this.temp;
  }

  /* ON SEARCH CANCEL, SETTING THE ORIGINAL DATA BACK TO ARRAY  */
  onSearchCancel() : any {
    this.data = this.temp;
  }

  /* REFRESHING DATA ON SWIPE DOWN */
  doRefresh(refresher) {
    /* IF INTERNET IS NOT AVAILABLE */
    if(!this.network.isInternetAvailable()){
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
    this.stop = new Stop(this.navCtrl,this.alert, this.parseData, this.parser, this.time);
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
    
    this.navCtrl.push(component, {project: this.project, data: this.temp });
  }

  is_Filtering(){
    this.isFiltering = !this.isFiltering;
  } 
}