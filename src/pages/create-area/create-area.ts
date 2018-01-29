import { Component , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { TimerComponent } from '../../components/timer/timer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationsProvider , AuthProvider , LoaderProvider , ToastProvider , SqlDbProvider , Time} from '../../providers';
import { MESSAGE, ERROR } from '../../config/config';

/**
 * Generated class for the CreateAreaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-area',
  templateUrl: 'create-area.html',
})
export class CreateAreaPage {

  @ViewChild(TimerComponent) timer: TimerComponent;
  public areaType: any;
  public types: any;
  public areaForm: FormGroup;
  public project: any;

  private TABLE_NAME: string = 'Areas';
  private TABLE_NAME_1: string = 'Areas_IDs';

  constructor(public navParams: NavParams,
              public navCtrl: NavController,
              public operations: OperationsProvider,
              public auth: AuthProvider,
              public loader: LoaderProvider,
              public toast: ToastProvider,
              public sql: SqlDbProvider,
              public storage: Storage,
              public formBuilder: FormBuilder,
              public time: Time) {
    this.initView();               
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAreaPage');
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter CreateAreaPage');
    this.timer.startTimer();
  }

  onChange(){
    console.log("AREA TYPE: " + this.areaType);
  }

  initView(){
    this.project = this.navParams.get('project');
    this.types = ['Area Type 1', 'Area Type 2', 'Area Type 3', 'Area Type 4', 'Area Type 5'];
    this.initFormBuilder();  
  }

  /* INITIALIZE FORM BUILDER */
  initFormBuilder(){
    this.areaForm = this.formBuilder.group({
      areaname: ['', Validators.required],
      areatype: [this.types[0], Validators.required],
      addedby:  '',
      id_of_addedby:  '',
      id_of_project: this.project._id,
      status:  'active',
      dateadded:  new Date()
    });
  }

/* SETTING CURRENT USER INFO TO THE FORM WHILE ADDING NEW ROLE */
setUserInfo() {
    this.storage.get('currentUser').then(user => {
      var name = user.firstname + ' ' + user.lastname;
      var id = user._id;
      this.areaForm.controls['addedby'].setValue(name);
      this.areaForm.controls['id_of_addedby'].setValue(id);
      this.createArea();
    });
  }
      
  /* ADD A NEW ROLE */
  createArea() {
      this.loader.showLoader(MESSAGE)
      this.operations.addData(this.areaForm.value,'areas/add').subscribe( res => {
          if(res.areaname == this.areaForm.value.areaname) 
            this.dropTable(res);              
          else
            this.toast.showToast(ERROR);
      },
      error => {
        this.loader.hideLoader();
        console.error('ERROR: ' + JSON.stringify(error));
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
    var _data = {project_id: this.project._id, _id: data._id};
    this.sql.addRow(this.TABLE_NAME_1,_data).then(result => {
      this.toast.showToast('Area added succesfully.');                
      this.loader.hideLoader();
      this.areaForm.reset();
      this.goBack();
    }).catch(error => {
      console.error("ERROR: " + JSON.stringify(error));
    });
  }

  goBack(){
    this.timer.pauseTimer();
    this.time.setTime(this.timer.getRemainingTime());
    this.navCtrl.pop();
  }

}
