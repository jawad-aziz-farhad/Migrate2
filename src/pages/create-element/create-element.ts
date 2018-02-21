import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators , FormControl } from '@angular/forms';
import { TimerComponent } from '../../components/timer/timer';
import { Storage } from "@ionic/storage";
import { OperationsProvider , LoaderProvider , AuthProvider, ToastProvider, SqlDbProvider, Time , NetworkProvider} from '../../providers';
import { MESSAGE, ERROR  } from '../../config/config';
import { Observable } from 'rxjs/Observable';
import { FormArray } from '@angular/forms/src/model';
/**
 * Generated class for the CreateElementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-element',
  templateUrl: 'create-element.html',
})
export class CreateElementPage {

  @ViewChild(TimerComponent) timer: TimerComponent;
  public elementForm: FormGroup;
  public project: any;
  private categories: Array<any>;
  private ratings: Array<any> = [];
  private types: Array<any> = [];
  private study_types: Array<any> = [];

  private e_study: boolean;
  private a_time: boolean;
  private r_study: boolean;
  private show: boolean;

  private typesModel: any;
  private ratingModel: any;
  private offline_types: Array<any> = [];

  private TABLE_NAME: string = 'Elements';
  private TABLE_NAME_1: string = 'Elements_IDs';
  private TABLE_NAME_2: string = 'Create_Element';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public operations: OperationsProvider,
              public loader: LoaderProvider,
              public auth: AuthProvider,
              public toast: ToastProvider,
              public sql: SqlDbProvider,
              public network: NetworkProvider,
              public storage: Storage,
              public formBuilder: FormBuilder,
              public time: Time) {
            
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateElementPage');
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter CreateElementPage');
    this.initView();
  }

  initView(){
    this.loader.showLoader(MESSAGE);
    this.show = this.e_study = this.r_study = this.a_time = false;
    this.ratings = this.types = this.study_types = [];
    this.ratings = [{ id: 1, name: 'Not Rated' },
                    { id: 2, name: '100' },
                    { id: 3, name: 'Field User Input' },
                  ];
    this.study_types = [ { id: 1, name: 'Efficiency Study' },
                         { id: 2, name: 'Activity Study' },
                         { id: 3, name: 'Role Study' }];
    this.types = [{id: 1, name: 'Fixed'}, { id: 2, name: 'Variable'}];
    this.project = this.navParams.get('project')
    this.timer.startTimer();
    this.getCategories();
  }

  /* GETTING CATEGORIES FOR CREATING NEW ELEMENT*/
  getCategories(){    
    this.operations.get_data('categories/get',null).subscribe(result => {
      this.loader.hideLoader();
      this.categories = result;
      this.initFormBuilder();
    },
    error => {
      this.loader.hideLoader();
    });
    
  }

  getOfflineCategories(){
    this.sql.getAllData('Categories').then(result => {
      this.categories = result;
      this.initFormBuilder();
    }).catch(error => console.error(error));
  }

  /* INITIALIZING FORM BUILDER */
  initFormBuilder(){
      this.elementForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(5)]],
        studyTypes: this.formBuilder.array([], Validators.required),
        type: ['', Validators.required],
        rating: ['', Validators.required],
        category: [this.categories[0]._id, Validators.required],
        addedBy:  this.formBuilder.group({
                    _id: '',
                    name :'',
                    date : new Date()
                  }),
        projectID: this.project._id,
        status:"active",
        userAdded: true
      });

      this.show = true;
  }

  initType(value){
    const control = new FormControl(value, Validators.required);
    return control;
  }

  addStudyType(id){
     const control = <FormArray>this.elementForm.controls['studyTypes'];
     const index = this.indexOf(id);
     if(index == -1)
       control.push(this.initType(id));
     else
      control.removeAt(index);
      
  } 

  indexOf(value): number{    
    const control = <FormArray>this.elementForm.controls['studyTypes'].value;    
    let result = -1;
    for(let i=0; i<control.length;i++){
      if(control[i] == value)
        result = i;
    }
    return result;
  }

   /* SETTING CURRENT USER INFO TO THE FORM WHILE ADDING NEW ROLE */
  setUserInfo() {
    this.storage.get('currentUser').then(user => {
      this.elementForm.get('addedBy.name').setValue(name);
      this.elementForm.get('addedBy._id').setValue(user._id);;
      this.addTypes();      
    });
  }

  /* ADDING TYPES */
  addTypes(){
    const formCtrl = <FormArray>this.elementForm.controls['studyTypes'];
    for(let i=0; i<this.study_types.length;i++){
        if(i == 0 && this.e_study){
          this.offline_types.push(1);
          formCtrl.push(this.formBuilder.control(1));
        }
        
        if(i == 1 && this.a_time){
          this.offline_types.push(2);
          formCtrl.push(this.formBuilder.control(2));
        }
          
        if(i == 2 && this.r_study){
          this.offline_types.push(3);
          formCtrl.push(this.formBuilder.control(3));
        }
    }

    this.elementForm.get('rating').setValue(this.ratingModel);
    this.elementForm.get('type').setValue(this.typesModel);

    this.checkInternet();
  }

  /* CHECKING INTERNET AVAILABILITY, IF NOT AVAILABLE ,SAVING DATA LOCALLY */
  checkInternet(){
    if(this.network.isInternetAvailable())
      this.createElement();
    else
      this.createTable();  
   }
 
  /* CREATING A NEW ELEMENT */
  createElement(){
   this.loader.showLoader(MESSAGE); 
   this.operations.addData(this.elementForm.value, 'elements/add').subscribe(res => {
      if(res.success) 
        this.dropTable(res);
      else
         this.toast.showToast(ERROR);
   },
   error => {
      this.loader.hideLoader();
      this.operations.handleError(error)
   });
  }

   /* DROPPING TABLE FROM DATA BASE */
   dropTable(data){
    this.sql.dropTable(this.TABLE_NAME).then(result => {
      if(result)
        this.insertData(data)
    }).catch(error => {
       console.error('ERROR: ' + JSON.stringify(error));
    });
  }

  /* INSERTING DATA TO TABLE */
  insertData(data) {
    let _data = {projectID: this.project._id, _id: data.elementID};
    this.sql.addRow(this.TABLE_NAME_1,_data).then(result => {
      this.toast.showToast('Element added succesfully.');                
      this.loader.hideLoader();
      this.elementForm.reset();
      this.goBack();
    }).catch(error => {
      console.error("ERROR: " + JSON.stringify(error));
    });
  }

  /* CREATING ROLES TABLE */
  createTable(){
    this.sql.createTable(this.TABLE_NAME_2).then(result => {
      this.create_Offline_Element();
    }).catch(error =>{
        console.log('ERROR: ' + JSON.stringify(error));
    });
  } 

  /* CREATING NEW ELEMENT IN OFFLINE MODE */
  create_Offline_Element() {
    let name     = this.elementForm.get('name').value;
    let category = this.elementForm.get('category').value;
    let username = this.elementForm.get('addedBy.name').value;
    let userid   = this.elementForm.get('addedBy._id').value;
    let date     = this.elementForm.get('addedBy.date').value;
    let userAdded = this.elementForm.get('userAdded').value;
    let _data = [{ _id: date + '-element', name: name, type: this.typesModel , rating: this.ratingModel , category:category,  
                   types: this.offline_types, projectID: this.project._id, addedby:username , 
                   id_of_addedby: userid, status: 'active', date: date, userAdded : userAdded}];
    this.sql.addData(this.TABLE_NAME_2,_data).then(result => {
      this.addElement(_data);
    }).catch(error => {
      console.log("ERROR: " + JSON.stringify(error));
    });
  }

  /* ADDING NEWLY CREATED ELEMENT IN ELEMENTS TABLE */
  addElement(data){
    let _data = [{ name: data[0].name, _id: data[0].date + '-element' , popularity: 0, rating: data[0].rating, numericID: 0, projectID: this.project._id}];
    this.sql.addData(this.TABLE_NAME,_data).then(result => {
      this.toast.showToast('Element added succesfully.');                
      this.elementForm.reset();
      this.goBack();
    }).catch(error => {
      console.log("ERROR: " + JSON.stringify(error));
    });
  }

  /* GOING BACK */
  goBack(){
    this.timer.pauseTimer();
    this.time.setTime(this.timer.getRemainingTime());
    this.navCtrl.pop({});
  }
  
}
