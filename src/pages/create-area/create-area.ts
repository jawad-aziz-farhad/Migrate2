import { Component , ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationsProvider  , LoaderProvider , ToastProvider , SqlDbProvider , NetworkProvider } from '../../providers';
import { MESSAGE, ERROR } from '../../config/config';
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

  // public areaForm: FormGroup;
  // public project: any;

  // private TABLE_NAME: string = 'Areas';
  // private TABLE_NAME_1: string = 'Areas_IDs';
  // private TABLE_NAME_2: string = 'Create_Area'

  constructor(public navParams: NavParams,
              public navCtrl: NavController,
              public operations: OperationsProvider,
              public loader: LoaderProvider,
              public toast: ToastProvider,
              public sql: SqlDbProvider,
              public network: NetworkProvider,
              public storage: Storage,
              public formBuilder: FormBuilder) {
    super(navCtrl, operations,loader,toast,sql,network,storage);
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

 

// /* SETTING CURRENT USER INFO TO THE FORM WHILE ADDING NEW ROLE */
// setUserInfo() {
//     this.storage.get('currentUser').then(user => {
//       let name = user.firstname + ' ' + user.lastname;
//       let id = user._id;
//       this.areaForm.get('addedBy.name').setValue(name);
//       this.areaForm.get('addedBy._id').setValue(id);
//       this.checkInternet();
//     });
//   }

//    /* CHECKING INTERNET AVAILABILITY, IF NOT AVAILABLE ,SAVING DATA LOCALLY */
//  checkInternet(){
//   if(this.network.isInternetAvailable())
//      this.createArea();
//   else
//     this.createTable();  
// }  
      
//   /* ADD A NEW ROLE */
//   createArea() {
//       this.loader.showLoader(MESSAGE)
//       this.operations.postRequest('areas/add', this.areaForm.value).subscribe( res => {
//           if(res.success)  
//             this.dropTable(res);              
//           else
//             this.toast.showToast(ERROR);
//       },
//       error => {
//         this.loader.hideLoader();
//         this.operations.handleError(error);
//       });
//     }

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
//     let _data = {projectID: this.project._id, _id: data.areaID};
//     this.sql.addRow(this.TABLE_NAME_1,_data).then(result => {
//       this.toast.showToast('Area added succesfully.');                
//       this.loader.hideLoader();
//       this.areaForm.reset();
//       this.goBack();
//     }).catch(error => {
//       console.error("ERROR: " + JSON.stringify(error));
//     });
//   }

//   /* CREATING AREAS TABLE */
//   createTable(){
//     this.sql.createTable(this.TABLE_NAME_2).then(result => {
//       this.create_Offline_Area();
//     }).catch(error =>{
//         console.log('ERROR: ' + JSON.stringify(error));
//     });
//   } 

//   /* CREATING NEW AREA IN OFFLINE MODE */
//   create_Offline_Area(){
//     let name = this.areaForm.get('name').value;
//     let username = this.areaForm.get('addedBy.name').value;
//     let userid   = this.areaForm.get('addedBy._id').value;
//     let date     = this.areaForm.get('addedBy.date').value;
//     let _data    = [{ _id: date + '-area' ,name: name, projectID: this.project._id, addedby:username , 
//                       id_of_addedby: userid, status: 'active', date: date}];
//     this.sql.addData(this.TABLE_NAME_2,_data).then(result => {
//       this.addArea(_data);
//     }).catch(error => {
//       console.log("ERROR: " + JSON.stringify(error));
//     });
//   }

//   /* ADDING NEWLY CREATED AREA IN AREAS TABLE */
//   addArea(data){
//     let _data = [{ name: data[0].name, _id: data[0].date + '-area'  , popularity: 0, rating: null, id: null, projectID: this.project._id}];
//     this.sql.addData(this.TABLE_NAME,_data).then(result => {
//       this.toast.showToast('Area added succesfully.');                
//       this.areaForm.reset();
//       this.goBack();
//     }).catch(error => {
//       console.log("ERROR: " + JSON.stringify(error));
//     });
//   }

//   /* GOING BACK TO PREVIOUS PAGE */
//   goBack(){
//     this.navCtrl.pop();
//   }

}
