import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder,  Validators , FormControl, FormArray } from '@angular/forms';
import { Storage } from "@ionic/storage";
import { OperationsProvider , LoaderProvider , AuthProvider, ToastProvider, SqlDbProvider , NetworkProvider} from '../../providers';
import { Creation } from '../../bases/creation';
import { MESSAGE } from '../../config/config';

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
export class CreateElementPage extends Creation {
  
  private categories: Array<any> = [];
  private ratings: Array<any> = [];
  private types: Array<any> = [];
  private study_types: Array<any> = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public operations: OperationsProvider,
              public loader: LoaderProvider,
              public auth: AuthProvider,
              public toast: ToastProvider,
              public sql: SqlDbProvider,
              public network: NetworkProvider,
              public storage: Storage,
              public formBuilder: FormBuilder) {
    super(navCtrl, navParams, operations,loader,toast,sql,network,storage);            
    this.initView();        
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateElementPage');
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter CreateElementPage');
  }

  initView(){
    this.show =  false;
    this.TABLE_NAME   = 'Elements';
    this.TABLE_NAME_1 = 'Elements_IDs';
    this.TABLE_NAME_2 = 'Create_Element';
    this.END_POINT    = "elements/add";
    this.ratings = this.types = this.study_types = [];
    this.ratings = [{ id: 1, name: 'Not Rated' },
                    { id: 2, name: '100' },
                    { id: 3, name: 'Field User Input' },
                  ];
    this.study_types = [ { id: 1, name: 'Efficiency Study' },
                         { id: 2, name: 'Activity Study' },
                         { id: 3, name: 'Role Study' }];
    this.types = [{id: 1, name: 'Fixed'}, { id: 2, name: 'Variable'}];
    this.project = this.navParams.get('project');
    /* IF INTERNET IS AVAILABLE , PULLING CATEGORIES FROM SERVER */
    if(this.network.isInternetAvailable())
      this.getCategories();
    /* PULLING CATEGORIES FROM SQLite Table */
    else
      this.getOfflineCategories();
  }

  /* GETTING CATEGORIES FOR CREATING NEW ELEMENT*/
  getCategories(){   
    this.loader.showLoader(MESSAGE); 
    this.operations.postRequest('categories/get',null).subscribe(result => {
      this.loader.hideLoader();
      this.categories = result;
      this.initFormBuilder();
    },
    error => {
      this.loader.hideLoader();
    });
    
  }

  /* GETTING OFFLINE CATEGORIES IF INTERNET IS NOT AVAILABLE */
  getOfflineCategories(){
    this.sql.getAllData('Categories').then(result => {
      this.categories = result;
      this.initFormBuilder();
    }).catch(error => console.error(error));
  }

  /* INITIALIZING FORM BUILDER */
  initFormBuilder(){
      this.creationForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(1)]],
        studyTypes: this.formBuilder.array([], Validators.required),
        type: ['', Validators.required],
        rating: ['', Validators.required],
        category: [this.categories[0], Validators.required],
        addedBy:  this.formBuilder.group({
                    _id: '',
                    name :'',
                    date : new Date()
                  }),
        projectID: this.project._id,
        status:"active",
        userAdded: true
      });

    this.creationForm.get('type').setValue(this.types[0].id);
    this.creationForm.get('rating').setValue(this.ratings[2].id);  
    this.show = true;
  }

  initType(value){
    const control = new FormControl(value, Validators.required);
    return control;
  }

  addStudyType(id){
    const control = <FormArray>this.creationForm.controls['studyTypes'];
    const index = this.indexOf(id);
    if(index == -1)
      control.push(this.initType(id));
    else
    control.removeAt(index);
  } 

  /* CHECKING THE VALUE INSIDE ARRAY */
  indexOf(value): number{    
    const control = <FormArray>this.creationForm.controls['studyTypes'].value;    
    let result = -1;
    for(let i=0; i<control.length;i++){
      if(control[i] == value)
        result = i;
    }
    return result;
  }

  
}
