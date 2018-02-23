import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationsProvider , AuthProvider , LoaderProvider , ToastProvider, SqlDbProvider,  NetworkProvider } from '../../providers';
import { MESSAGE, ERROR } from '../../config/config';
import { Network } from '@ionic-native/network';
import { Creation } from '../../bases/creation';
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
export class CreateRolePage extends Creation {

  public positions: Array<any>;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public operations: OperationsProvider,
              public auth: AuthProvider,
              public loader: LoaderProvider,
              public toast: ToastProvider,
              public storage: Storage,
              public sql: SqlDbProvider,
              public network: NetworkProvider,
              public formBuilder: FormBuilder) {
    super(navCtrl, operations,loader,toast,sql,network,storage);              
    this.initView();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateRolePage');
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter CreateRolePage');
  }

  initView(){
    this.TABLE_NAME = 'Roles';
    this.TABLE_NAME_1 = 'Roles_IDs';
    this.TABLE_NAME_2 = 'Create_Role';
    this.END_POINT = "roles/add";
    this.positions = [
    { id: 1, value: 'Director' },
    { id: 2, value: 'Manager' },
    { id: 3, value: 'Supervisor/Team Leader' },
    { id: 4, value: 'Colleague' }
  ];
    this.project = this.navParams.get('project');
    this.initFormBuilder();  
  }

  /* INITIALIZE FORM BUILDER */
  initFormBuilder(){
    this.creationForm = this.formBuilder.group({
        name: ['', Validators.required],
        position: ['', Validators.required],
        addedBy:  this.formBuilder.group({
                    _id: '',
                    name :'',
                    date : new Date()
                  }),
        status: 'active',
        projectID: this.project._id
      });
  }
    
}
