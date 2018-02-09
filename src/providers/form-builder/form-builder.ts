import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray ,Validators, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
/*
  Generated class for the FormBuilderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FormBuilderProvider {

  dataForm: FormGroup;
  constructor(public formBuilder: FormBuilder,
              public storage: Storage) {
    console.log('Hello FormBuilderProvider Provider');
  }

  /* INITIALIZING FORMBUILDER OBJECT */
  initFormBuilder(data, user){ 
    this.dataForm = this.formBuilder.group({
      name: [data.title],
      studyStartTime: [data.studyStartTime],
      studyEndTime:[data.studyEndTime],
      customerID: [data.customer.customer_id],
      projectID: [data.customer._id],
      userID: [user._id],
      rounds: this.formBuilder.array([ ])
    });
  
    this.addRounds(data);  
  }

  /* ADDING ROUNDS */
  addRounds(data){
    const formCtrl = <FormArray>this.dataForm.controls['rounds'];
    data.rounds.forEach(item => {
      formCtrl.push(this.formBuilder.group({
        roundStartTime: [item.roundStartTime, Validators.required],
        roundEndTime: [item.roundEndTime, Validators.required],
        data: this.formBuilder.array([ ])
    }));
    });

    this.addData(data);
}
 
/* ADDING DATA TO EACH ROUND */
addData(data) {
  data.rounds.forEach((item, index) => {
    const formCtrl = (<FormArray>this.dataForm.controls['rounds']).at(index).get('data') as FormArray;;
    item.data.forEach(sub_item => {
    formCtrl.push(this.formBuilder.group({
       role: [sub_item.role._id],
       element: [sub_item.element._id],
       area: [sub_item.area._id],
       rating: [sub_item.rating],
       frequency: [sub_item.frequency],
       notes: [sub_item.notes],
       photo: [sub_item.photo],
       observationTime: [sub_item.observationTime ]
     }));
   });
  });   

 }
  
  getFormBuilder(): FormGroup {
    return this.dataForm;
  }

  initIDForm(ids) {
    this.dataForm = this.formBuilder.group({
      ids: [ ids ]
    });
  }

  getIDForm(): FormGroup {
    return this.dataForm;
  }

  initFormForOfflineData(val, data, user){
     let formData = null;
     formData = {addedby:  [user.firstname + ' ' + user.lastname], id_of_addedby: [user._id], id_of_project: [data.project_id], status:  'active', dateadded: new Date() }
     
     if(val == 'area'){
      formData.areaname = [data.name],
      formData.areatype = 'Area Type 1';
     }
     else if(val == 'role'){
       formData.rolename = [data.name ],
       formData.position = [data.position];
     }
    else if(val == 'element'){

    }
    
    this.dataForm = this.formBuilder.group({ formData });

   
  }

}
