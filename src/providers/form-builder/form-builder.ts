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
      locationID: [data.locationID],
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
      /* FORM DATA FOR ROLES DOCUMENT */
      if(data.position)
        formData = {
          name: data.name,
          position: data.position,
          addedBy:  this.formBuilder.group({
            _id: data.id_of_addedby,
            name :data.addedby,
            date : data.dateadded
          }),
          status: data.status,
          projectID: data.projectID
        }
      
      /* FORM DATA FOR ELEMENTS DOCUMENT */
      else if(data.types){
        let studyTypes = [];
        if(data.efficiency_study == 1)
          studyTypes.push[1];
        if(data.activity_study)
          studyTypes.push[2];
        if(data.role_study)
          studyTypes.push(3);

        formData = {
          name: data.name ,
          studyTypes: studyTypes,
          type: data.type,
          rating: data.rating,
          category: data.category,
          addedBy:  this.formBuilder.group({
                                  _id: data.id_of_addedby,
                                  name :data.addedby,
                                  date : data.dateadded
                                }),
          projectID: data.projectID,
          status: data.status,
          userAdded: data.userAdded
        }
      }
      /* FORM DATA FOR AREAS DOCUMENT */
      else
      formData = 
      { name: data.name,
        addedBy:  this.formBuilder.group({
                      _id: data.id_of_addedby,
                      name :data.addedby,
                      date : data.dateadded
                    }),
        projectID: data.projectID,
        status:  data.status
      }

    this.dataForm = this.formBuilder.group(formData);
  }

  getFormForOfflineData(){
    return this.dataForm;
  }
}
