import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimerComponent } from '../../components/timer/timer';
import { OperationsProvider , AuthProvider , LoaderProvider , ToastProvider, SqlDbProvider, Time} from '../../providers';
import { MESSAGE, ERROR } from '../../config/config';
/**
 * Generated class for the CreateRolePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-role',
  templateUrl: 'create-role.html',
})
export class CreateRolePage {

  @ViewChild(TimerComponent) timer: TimerComponent;
  public roleForm: FormGroup;
  public roles: any;
  public project: any;
  private TABLE_NAME: string = 'Roles';
  private TABLE_NAME_1: string = 'Roles_IDs';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public operations: OperationsProvider,
              public auth: AuthProvider,
              public loader: LoaderProvider,
              public toast: ToastProvider,
              public storage: Storage,
              public sql: SqlDbProvider,
              public formBuilder: FormBuilder,
              public time: Time) {
    this.initView();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateRolePage');
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter CreateRolePage');
    this.timer.startTimer();
  }

  initView(){
    this.roles = ['Director', 'Manager', 'Supervisor', 'Colleague', 'Customer'];
    this.project = this.navParams.get('project');
    this.initFormBuilder();  
  }

  /* INITIALIZE FORM BUILDER */
  initFormBuilder(){
    
    this.roleForm = this.formBuilder.group({
            rolename: ['', Validators.required],
            position: [this.roles[0], Validators.required],
            addedby:'',
            id_of_addedby: '',
            status: 'active',
            id_of_project: this.project._id,
            dateadded: new Date()
      });
  }

/* SETTING CURRENT USER INFO TO THE FORM WHILE ADDING NEW ROLE */
setUserInfo() {
    this.storage.get('currentUser').then(user => {
      var name = user.firstname + ' ' + user.lastname;
      var id = user._id;
      this.roleForm.controls['addedby'].setValue(name);
      this.roleForm.controls['id_of_addedby'].setValue(id);
      this.createRole();
    });
  }
      
  /* ADD A NEW ROLE */
  createRole() {
      this.loader.showLoader(MESSAGE);
      this.operations.addData(this.roleForm.value,'roles/add').subscribe(res => {
          if(res.rolename == this.roleForm.value.rolename) 
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
      this.toast.showToast('Role added succesfully.');                
      this.loader.hideLoader();
      this.roleForm.reset();
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
