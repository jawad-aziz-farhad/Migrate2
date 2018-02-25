
import { NavController, MenuController } from 'ionic-angular';
import { ToastProvider, LoaderProvider, FormBuilderProvider, SearchProvider, AlertProvider, ParseDataProvider,
         OperationsProvider, SqlDbProvider, NetworkProvider, Time} from '../providers';
import { ERROR , MESSAGE, INTERNET_ERROR, ALERT_TITLE, STUDY_CANCELING_MESSAGE } from '../config/config';
import { StudyData } from '../models';
import { CreateAreaPage } from '../pages/create-area/create-area';
import { CreateElementPage } from '../pages/create-element/create-element';
import { CreateRolePage } from '../pages/create-role/create-role';
import { RatingsPage } from '../pages/ratings/ratings';
import { AddFrequencyPage } from '../pages/add-frequency/add-frequency';
import { Stop } from './stop-study';

export class Selection {
  
  protected TABLE_NAME: string = '';
  protected TABLE_NAME_1: string = '';
  protected project: any;
  protected temp: any;
  protected _temp: any;
  protected isFiltering: boolean;
  protected show: boolean;
  protected data: Array<any>;
  protected nextComponent: any;

  private stop: Stop;

  constructor(public navCtrl: NavController,
              public time: Time ,
              public parseData: ParseDataProvider,
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

  init(TABLE_NAME: string, TABLE_NAME_1: string, project: any, nextComponent: any){
      this.show = false;
      this.nextComponent = nextComponent;
      this.TABLE_NAME = TABLE_NAME;
      this.TABLE_NAME_1 = TABLE_NAME_1;
      this.project = project;
      this.pullSQLData();
  }

  /* PULLING SQLite DATA */
  pullSQLData(){

    const data = this.sql.getIDData(this.TABLE_NAME,this.project._id);

    data.then((result: any) => {
      console.log("SQL DATA: "+ JSON.stringify(result));
       if(result.length > 0)
          this.populateData(result);
        else
          this.pullIDs();  
    }).catch(error => this.handleError(error));
     
  }           
 
  /* PULLING IDs FROM SQLite */
  pullIDs(){
    const ids = this.sql.getIDData(this.TABLE_NAME_1, this.project._id);
    ids.then(result => {
      console.log('IDs: '+ JSON.stringify(result));
      this.pullServerData(result);
    }).catch(error => this.handleError(error) );
    

  }
  /* PULLING DATA FROM SERVER */
  pullServerData(result){
    this.formBuilder.initIDForm(result);
    let formData = this.formBuilder.getIDForm().value;
    const data = this.operations.postRequest(this.TABLE_NAME.toLowerCase()+ '/getByIds', formData)
    
    data.subscribe(data => {   
      console.log("SERVER DATA:"+ JSON.stringify(data));   
      if(data.result.lenght == 0){
        this.loader.hideLoader();
        return;
      }
      data.result.forEach((element,index) => {
        element.projectID = this.project._id;  
      });
      
      this.createTable(data.result)
    },
    error => {
      this.handleError(error);
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
    this.loader.hideLoader();
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
     let study_data = null;
     if(this.parseData.getData() == null || typeof this.parseData.getData() == 'undefined')
        study_data = new StudyData();
     else
        study_data = this.parseData.getData();   
     
    if(this.TABLE_NAME == 'Areas')
      study_data.setArea(item);
    else if(this.TABLE_NAME == 'Elements')
      study_data.setElement(item);
    else if(this.TABLE_NAME == 'Roles')
      study_data.setRole(item);
    
    this.parseData.setData(study_data);
    this.goNext();
  }

  /* GOING TO THE NEXT PAGE */
  goNext() {
    
    if(this.TABLE_NAME == 'Elements'){
        if(this._temp.rating == null || this._temp.rating == 3)
            this.nextComponent =  RatingsPage ;
        
        else{
          /* SETTING RATING VALUE AND SKIPPING RATINGS PAGE */
          let rating = null
          if(this._temp.rating == 1)
            rating = 'Not Rated';
          else if(this._temp.rating == 2)
            rating = 100;  
          this.parseData.getData().setRating(rating);
          this.parseData.setData(this.parseData.getData());
          this.nextComponent = AddFrequencyPage;
        }
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
    this.loader.hideLoader();
    console.error('ERROR: ' + error);
  }

 /* WHEN USER TYPES TO SEARCH */ 
 onSearchInput(searchInput): any{
    if(typeof searchInput !== 'undefined' && searchInput.length > 3){
      let searchResult = this.search.search_Item(this.data, searchInput , this.TABLE_NAME.toLowerCase());
      if(searchResult.length > 0)
      this.data = this.search.search_Item(this.data, searchInput , this.TABLE_NAME.toLowerCase().slice(0,-1));
    }
         
    else{
      console.log(JSON.stringify(this.temp));        
      this.data = this.temp;
    }

     return this.data; 
      
  }

  onSearchCancel(data) : any {
    this.data = data;
    return this.data;
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
    this.loader.showLoader(MESSAGE);
    this.sql.dropTable(this.TABLE_NAME).then(result => {
      if(refresher != '')
        refresher.complete();
      this.pullIDs();
    }).catch(error => this.handleError(error));
  }
  
  /* CANCELLING STUDY */ 
  cancelStudy() {
    this.stop = new Stop(this.navCtrl,this.alert, this.time);
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
    
    this.navCtrl.push(component, {project: this.project});
  }

  is_Filtering(){
    this.isFiltering = !this.isFiltering;
  } 
}