import { NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { FormBuilder, FormGroup, FormArray , Validators } from '@angular/forms';
import { OperationsProvider , AuthProvider , LoaderProvider , ToastProvider , SqlDbProvider , Time, NetworkProvider } from '../providers';
import { MESSAGE, ERROR } from '../config/config';

export class Creation {

    protected TABLE_NAME: string = '';
    protected TABLE_NAME_1: string = '';
    protected TABLE_NAME_2: string = '';
    protected END_POINT: string = '';
    protected creationForm: FormGroup;
    protected project: any;
    protected show: boolean;

    constructor(public navCtrl: NavController,
                public operations: OperationsProvider,
                public loader: LoaderProvider,
                public toast: ToastProvider,
                public sql: SqlDbProvider,
                public network: NetworkProvider,
                public storage: Storage){

    }



/* SETTING CURRENT USER INFO TO THE FORM WHILE ADDING NEW ROLE */
setUserInfo() {
    this.storage.get('currentUser').then(user => {
        let name = user.firstname + ' ' + user.lastname;
        let id = user._id;
        this.creationForm.get('addedBy.name').setValue(name);
        this.creationForm.get('addedBy._id').setValue(id);
        this.checkInternet();
    });
  }

   /* CHECKING INTERNET AVAILABILITY, IF NOT AVAILABLE ,SAVING DATA LOCALLY */
 checkInternet(){
  if(this.network.isInternetAvailable())
     this.createArea();
  else
    this.createTable();  
}  
      
  /* ADD A NEW ROLE */
  createArea() {
      this.loader.showLoader(MESSAGE)
      this.operations.postRequest(this.END_POINT, this.creationForm.value).subscribe( res => {
          if(res.success)  
            this.dropTable(res);              
          else{
            this.loader.hideLoader();
            this.toast.showToast(ERROR);
          }
      },
      error => {
        this.loader.hideLoader();
        this.operations.handleError(error);
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
    let _id = null;
    if(this.TABLE_NAME == 'Areas')
      _id = data.areaID;
    else if(this.TABLE_NAME == 'Elements')
      _id = data.elementID;
    else if(this.TABLE_NAME == 'Roles')
      _id = data.roleID;   
    let _data = {projectID: this.project._id, _id: _id };
    this.sql.addRow(this.TABLE_NAME_1,_data).then(result => {
      this.goBack();
    }).catch(error => {
      console.error("ERROR: " + JSON.stringify(error));
    });
  }

  /* CREATING AREAS TABLE */
  createTable(){
    this.sql.createTable(this.TABLE_NAME_2).then(result => {
      this.create_Offline_Entry();
    }).catch(error =>{
        console.log('ERROR: ' + JSON.stringify(error));
    });
  } 

  /* CREATING NEW AREA IN OFFLINE MODE */
  create_Offline_Entry(){    
    this.sql.addData(this.TABLE_NAME_2,this.getData()).then(result => {
      this.addEntry();
    }).catch(error => {
      console.log("ERROR: " + JSON.stringify(error));
    });
  }

  /* ADDING NEWLY CREATED TABLE_NAME  */
  addEntry(){
    this.sql.addData(this.TABLE_NAME,this.getData()).then(result => {
      this.goBack();
    }).catch(error => {
      console.log("ERROR: " + JSON.stringify(error));
    });
  }

  getData(): Array<any> {

    let name     = this.creationForm.get('name').value;
    let username = this.creationForm.get('addedBy.name').value;
    let userid   = this.creationForm.get('addedBy._id').value;
    let date     = this.creationForm.get('addedBy.date').value;
    let _id = null; let rating = null; let offlineTypes = null;
    let userAdded = null; let category = null;let type  = null;
    let position = null;

    if(this.TABLE_NAME == 'Areas')
        _id = date + '-area';
    else if(this.TABLE_NAME == 'Elements'){
              _id = date + '-element';
        rating    = this.creationForm.get('rating');
        userAdded = this.creationForm.get('userAdded').value;
        category  = this.creationForm.get('category').value;
        type      = this.creationForm.get('type').value;

        const typesArray = <FormArray>this.creationForm.get('studyTypes').value;
        for(let i=0;i< typesArray.length;i++){
            offlineTypes += typesArray[i];
            if(i < (typesArray.length - 1))
                offlineTypes += ',';
        }

    }
    else if(this.TABLE_NAME == 'Roles'){
             _id = date + '-role';     
        position = this.creationForm.get('position').value;
    }

    let data = [{ _id: _id, name: name, position: position, type: type , rating: rating , category: category,  
                   types: offlineTypes, projectID: this.project._id, addedby:username , 
                   id_of_addedby: userid, status: 'active', date: date, userAdded : userAdded}];

    return data;           
  }


  /* GOING BACK TO PREVIOUS PAGE */
  goBack(){
    let message = this.TABLE_NAME.slice(0,-1) + 'added succesfully.';  
    this.toast.showToast(message);                
    this.loader.hideLoader();
    this.creationForm.reset();  
    this.navCtrl.pop();
  }
}
