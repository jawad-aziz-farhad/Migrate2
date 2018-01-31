import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators , FormControl } from '@angular/forms';
import { TimerComponent } from '../../components/timer/timer';
import { Storage } from "@ionic/storage";
import { OperationsProvider , LoaderProvider , AuthProvider, ToastProvider, SqlDbProvider, Time } from '../../providers';
import { MESSAGE, ERROR } from '../../config/config';
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
  private categories: Observable<Array<any>>;
  private ratings: Array<any> = [];
  private types: Array<any> = [];
  private study_types: Array<any> = [];

  private e_study: boolean;
  private a_time: boolean;
  private r_study: boolean;
  private show: boolean;

  private typesModel: any;
  private ratingModel: any;

  private TABLE_NAME: string = 'Elements';
  private TABLE_NAME_1: string = 'Elements_IDs';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public operations: OperationsProvider,
              public loader: LoaderProvider,
              public auth: AuthProvider,
              public toast: ToastProvider,
              public sql: SqlDbProvider,
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
    this.ratings = [100 , 'Not Rated', 'Field User Input'];
    this.study_types = ['Efficiency Study' , 'Activity Time' , 'Role Study'];
    this.types = ['variable', 'fixed'];
    this.project = this.navParams.get('project')
    this.timer.startTimer();
    this.getCategories();
  }

  /* INITIALIZING FORM BUILDER */
  initFormBuilder(){
      this.elementForm = this.formBuilder.group({
          id: [new Date().valueOf()],
          description: ['', [Validators.required, Validators.minLength(5)]],
          types: this.formBuilder.array([]),
          element_type: [''],
          rating: ['', Validators.required],
          category: [this.categories[0], Validators.required],
          userId: ['', Validators.required],
          id_of_project: [this.project._id , Validators.required],
          popularity_number: [0, Validators.required],
          dateadded: [new Date(), Validators.required],
          status:["active", Validators.required]
      });

     this.show = true; 
  }

  addTypes(){
    const formCtrl = <FormArray>this.elementForm.controls['types'];
    for(let i=0; i<this.study_types.length;i++){
        if(i == 0 && this.e_study)
          formCtrl.push(this.formBuilder.control(this.study_types[0]));

        else if(i == 1 && this.a_time)
          formCtrl.push(this.formBuilder.control(this.study_types[1]));
          
        else if(i == 2 && this.r_study)
          formCtrl.push(this.formBuilder.control(this.study_types[2]));
    }

    this.elementForm.get('rating').setValue(this.ratingModel);
    this.elementForm.get('element_type').setValue(this.typesModel);

    this.createElement();
  }

  getCategories(){
    this.operations.get('categories').subscribe(result => {
      this.loader.hideLoader();
      this.categories = result;
      this.initFormBuilder();
    },
    error => {
    this.loader.hideLoader();
    });
    
  }

  /* SETTING CURRENT USER INFO TO THE FORM WHILE ADDING NEW ROLE */
  setUserInfo() {
    this.storage.get('currentUser').then(user => {
      let id = user._id;
      this.elementForm.controls['userId'].setValue(id);
       this.addTypes();
      //this.createElement();
    });
  }

  /* CREATING A NEW ELEMENT */
  createElement(){
   this.loader.showLoader(MESSAGE); 
   this.operations.addData(this.elementForm.value, 'elements/add').subscribe(res => {
      if(res.description == this.elementForm.value.description)
        this.dropTable(res);
      else
         this.toast.showToast(ERROR);
   },
   error => {
      this.loader.hideLoader();
      console.error("ERROR: "+ JSON.stringify(error))
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
    let _data = {project_id: this.project._id, _id: data._id};
    this.sql.addRow(this.TABLE_NAME_1,_data).then(result => {
      this.toast.showToast('Element added succesfully.');                
      this.loader.hideLoader();
      this.elementForm.reset();
      this.goBack();
    }).catch(error => {
      console.error("ERROR: " + JSON.stringify(error));
    });
  }

  goBack(){
    this.timer.pauseTimer();
    this.time.setTime(this.timer.getRemainingTime());
    this.navCtrl.pop({});
  }
  
}
