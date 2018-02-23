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

 
  public positions: any;
  
  // public roleForm: FormGroup;
  // public project: any;
  // private TABLE_NAME: string = 'Roles';
  // private TABLE_NAME_1: string = 'Roles_IDs';
  // private TABLE_NAME_2: string = 'Create_Role';

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
 
/* SETTING CURRENT USER INFO TO THE FORM WHILE ADDING NEW ROLE */
// setUserInfo() {
//     this.storage.get('currentUser').then(user => {
//       let name = user.firstname + ' ' + user.lastname;
//       const id = user._id;
//       this.roleForm.get('addedBy.name').setValue(name);
//       this.roleForm.get('addedBy._id').setValue(id);
//       this.checkInternet();
//     });
//   }

//    /* CHECKING INTERNET AVAILABILITY, IF NOT AVAILABLE ,SAVING DATA LOCALLY */
//   checkInternet(){
//     if(this.network.isInternetAvailable())
//       this.createRole();
//     else
//       this.createTable();  
//   }

//   /* ADD A NEW ROLE */
//   createRole() {
//       this.loader.showLoader(MESSAGE);
//       this.operations.postRequest('roles/add' , this.roleForm.value).subscribe(res => {
//           if(res.success) 
//             this.dropTable(res);
//           else
//             this.toast.showToast(ERROR);
//         },
//         error => {
//           this.loader.hideLoader();
//           this.operations.handleError(error);
//     });
//   }

//   /* DROPPING TABLE FROM DATA BASE */
//   dropTable(data){
//     this.sql.dropTable(this.TABLE_NAME).then(result => {
//       if(result)
//         this.insertData(data)
//     }).catch(error => {
//        console.error('ERROR: ' + JSON.stringify(error));
//     });
//   }

//   /* INSERTING DATA TO TABLE */
//   insertData(data) {
//     let _data = {projectID: this.project._id, _id: data.roleID};
//     this.sql.addRow(this.TABLE_NAME_1,_data).then(result => {
//       this.toast.showToast('Role added succesfully.');                
//       this.loader.hideLoader();
//       this.roleForm.reset();
//       this.goBack();
//     }).catch(error => {
//       console.error("ERROR: " + JSON.stringify(error));
//     });
//   }

//   /* CREATING ROLES TABLE */
//   createTable(){
//     this.sql.createTable(this.TABLE_NAME_2).then(result => {
//       this.create_Offline_Role();
//     }).catch(error =>{
//         console.log('ERROR: ' + JSON.stringify(error));
//     });
//   } 

//   /* CREATING NEW ROLE IN OFFLINE MODE */
//   create_Offline_Role(){
//     let name = this.roleForm.get('name').value;
//     let position = this.roleForm.get('position').value;
//     let username = this.roleForm.get('addedBy.name').value;
//     let userid   = this.roleForm.get('addedBy._id').value;
//     let date     = this.roleForm.get('addedBy.date').value;
//     let _data    = [{ _id: date + '-role' , name: name, position: position, projectID: this.project._id, addedby:username, id_of_addedby: userid,
//                       status: 'active', date: date}];
//     this.sql.addData(this.TABLE_NAME_2,_data).then(result => {
//       this.addRole(_data);
//     }).catch(error => {
//       console.log("ERROR: " + JSON.stringify(error));
//     });
//   }

//   /* ADDING NEWLY CREATED ROLE IN ROLES TABLE */
//   addRole(data){
//     let _data = [{ name: data[0].name, _id: data[0].date + '-role' , popularity: 0, rating: null, numbericID: null, projectID: this.project._id}];
//     this.sql.addData(this.TABLE_NAME,_data).then(result => {
//       this.toast.showToast('Role added succesfully.');                
//       this.roleForm.reset();
//       this.goBack();
//     }).catch(error => {
//       console.log("ERROR: " + JSON.stringify(error));
//     });
//   }

//   /* GOING BACK TO PREVIOUS  */
//   goBack(){
//     this.navCtrl.pop();
//   }
    
}
