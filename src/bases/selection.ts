
import { NavController, MenuController, NavParams } from 'ionic-angular';
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
  //protected TABLE_NAME_1: string = '';
  protected project: any;
  protected temp: any;
  protected _temp: any;
  protected isFiltering: boolean;
  protected show: boolean;
  protected data: Array<any>;
  protected nextComponent: any;
  protected searchInput: any;

  private stop: Stop;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
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

  init(TABLE_NAME: string, project: any, nextComponent: any){
      this.show = false;
      this.nextComponent = nextComponent;
      this.TABLE_NAME = TABLE_NAME;
      //this.TABLE_NAME_1 = TABLE_NAME_1;
      this.project = project;
      this.pullSQLData();
  }

  /* PULLING SQLite DATA */
  pullSQLData(){
    const data = this.sql.getIDData(this.TABLE_NAME,this.project._id);
    data.then((result: any) => {
      if(result.length > 0)
        this.populateData(result);
      else
        this.pullServerData();  
    }).catch(error => this.handleError(error));
     
  }           
 
  /* PULLING IDs FROM SQLite */
  pullIDs(){
    // const ids = this.sql.getIDData(this.TABLE_NAME_1, this.project._id);
    // ids.then(result => {
    //   console.log('IDs: '+ JSON.stringify(result));
    //   this.pullServerData(result);
    // }).catch(error => this.handleError(error) );
    

  }
  /* PULLING DATA FROM SERVER */
  pullServerData(){
    this.loader.showLoader(MESSAGE);
    //this.formBuilder.initIDForm(result);
    //let formData = this.formBuilder.getIDForm().value;
    //let endPoint = this.TABLE_NAME.toLowerCase()+ '/getByIDs';
    
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
        if(data.result)
          this.createTable(data.result);
        else
          this.createTable(data) 
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
        if(this._temp.rating == null || this._temp.rating == 3)
            this.nextComponent =  RatingsPage ;
        
        else{
          console.log("RATING OF SELECTED ELEMENT: \n" + JSON.stringify(this.temp));
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
    
    this.navCtrl.push(component, {project: this.project, data: this.temp });
  }

  is_Filtering(){
    this.isFiltering = !this.isFiltering;
  } 
}