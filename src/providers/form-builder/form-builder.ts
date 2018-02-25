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

  initFormForOfflineData(data){
   let formData=null;
   if(typeof data.areaname != 'undefined')
   formData= {
      areaname: [data.areaname],
      areatype: [data.areatype],
      addedby:  [data.addedby],
      id_of_addedby:  [data.id_of_addedby],
      id_of_project: [data.id_of_project],
      status:  [data.status],
      dateadded:  [data.dateadded]
    };

   else if(typeof data.rolename != 'undefined')
    formData= {
      rolename: [data.rolename],
      position: [data.position],
      addedby:  [data.addedby],
      id_of_addedby:  [data.id_of_addedby],
      id_of_project: [data.id_of_project],
      status:  [data.status],
      dateadded:  [data.dateadded]
    };

   else if(typeof data.description !== 'undefined')
    formData= {
        id: [new Date().valueOf()],
        description: [data.description],
        types: [data.types],
        element_type: [data.element_type],
        rating: [data.rating],
        category: [data.category],
        userId: [data.userId],
        addedby: [data.addedby],
        id_of_project: [data.id_of_project],
        popularity_number: [0],
        dateadded: [data.dateadded],
        status:[data.status]
    };  
    this.dataForm = this.formBuilder.group(formData);
  }

  getFormForOfflineData(){
    return this.dataForm;
  }
}
