import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder,  Validators , FormControl, FormArray, FormGroup } from '@angular/forms';
import { Storage } from "@ionic/storage";
import { OperationsProvider , LoaderProvider , AuthProvider, ToastProvider, SqlDbProvider , NetworkProvider} from '../../providers';
import { Creation } from '../../bases';
import { MESSAGE } from '../../config/config';

// import { Creation } from '../../bases';
// import { MESSAGE } from '../../config/config';
/**
 * Generated class for the CreateTaskPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-task',
  templateUrl: 'create-task.html',
})
export class CreateTaskPage {

  private allowances: Array<any> = [];
  private elements: Array<any> = [];
  private creationForm: FormGroup;
  private project: any;
  private show: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public operations: OperationsProvider,
    public loader: LoaderProvider,
    public toast: ToastProvider,
    public sql: SqlDbProvider,
    public network: NetworkProvider,
    public storage: Storage,
    public formBuilder: FormBuilder) {
  this.initView();        
}
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateTaskPage');
  }

  initView(){
    this.show = false;
    this.project = this.navParams.get('project');
    this.allowances = ['5%', '10%', '11%', '15%', '21%', '30%'];
    this.getElements();
  }

  getElements(){
    this.loader.showLoader(MESSAGE); 
    this.operations.postRequest('elements/get',null).subscribe(result => {
      this.loader.hideLoader();
      this.elements = result;
      this.initFormBuilder();
    },
    error => {
      this.loader.hideLoader();
    });
  }

  /* INITIALIZING FORM BUILDER */
  initFormBuilder(){
    this.creationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      relaxationAllowance: [ '', Validators.required ],
      addedBy:  this.formBuilder.group({
                  _id: localStorage.getItem("userID"),
                  name :localStorage.getItem("userName"),
                  date : new Date()
                }),
      projectID: this.project._id,
      status:"active",
      elements: this.formBuilder.array([this.initElements()], Validators.required )
    });

    // const elements = <FormArray>this.creationForm.get('elements');
    // elements.controls[0].get('controlling').setValue(true);
    this.show = true;

  }
  /* INITIALIZING ELEMENTS ARRAY */
  initElements(){
    return this.formBuilder.group({
      _id: ['', Validators.required],
      controlling: [false,Validators.required]
    })
  }

  /* ADDING NEW ELEMENT  */
  addElement(){
    const elements = <FormArray>this.creationForm.get('elements');
    elements.push(this.initElements());
  }

  /* REMOVING ELEMENT */
  removeElement(index: number){
    const elements = <FormArray>this.creationForm.get('elements');
    elements.removeAt(index);
  }

  /* CHANGING CONTROLLING ELEMENT  */
  changeControl(index: number, event){
    const elements = <FormArray>this.creationForm.get('elements');
    for(let i=0; i<elements.length;i++){
      if(i == index && event.checked)
        elements.controls[index].get('controlling').setValue(true);
      else 
        elements.controls[i].get('controlling').setValue(false);
    }
  }

  /* CREATING TASK */
  createTask(){

  }

}
