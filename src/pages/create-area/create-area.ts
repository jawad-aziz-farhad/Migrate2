import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormBuilder,  Validators } from '@angular/forms';
import { OperationsProvider  , LoaderProvider , ToastProvider , SqlDbProvider , NetworkProvider } from '../../providers';
import { Creation } from '../../bases/creation';
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
export class CreateAreaPage extends Creation {

  constructor(public navParams: NavParams,
              public navCtrl: NavController,
              public operations: OperationsProvider,
              public loader: LoaderProvider,
              public toast: ToastProvider,
              public sql: SqlDbProvider,
              public network: NetworkProvider,
              public storage: Storage,
              public formBuilder: FormBuilder) {
    super(navCtrl,navParams, operations,loader,toast,sql,network,storage);
    this.initView();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAreaPage');
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter CreateAreaPage');
  }

  initView(){
    this.show = false;
    this.TABLE_NAME   = 'Areas';
    this.TABLE_NAME_1 = 'Areas_IDs';
    this.TABLE_NAME_2 = 'Create_Area';
    this.END_POINT    = 'areas/add';
    this.project = this.navParams.get('project');
    this.initFormBuilder();  
  }

  /* INITIALIZE FORM BUILDER */
  initFormBuilder(){
    this.creationForm = this.formBuilder.group({
      name: ['', Validators.required],
      addedBy:  this.formBuilder.group({
                    _id: '',
                    name :'',
                    date : new Date()
                  }),
      projectID: this.project._id,
      status:  'active'
    });

    this.show = true;
  }

}
