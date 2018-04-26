import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
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
  initFormBuilder(data){     
    this.dataForm = this.formBuilder.group({
      name: [data.title],
      studyStartTime: [data.studyStartTime],
      studyEndTime:[data.studyEndTime],
      customerID: [data.customer.customer_id],
      projectID: [data.customer._id],
      locationID: [data.locationID],
      userID: [localStorage.getItem("userID")],
      roundDuration: [data.roundDuration],
      addedBy: this.formBuilder.group({
                date: new Date(),
                name: localStorage.getItem("userName"),
                _id: localStorage.getItem("userID")
              }),
      area: data.area._id,        
      data: this.formBuilder.array([ ])
    });
  
    this.addData(data);  
  }
 
  /* ADDING DATA TO EACH ROUND */
  addData(data) {
    const formCtrl = <FormArray>this.dataForm.controls['data'];
    data.data.forEach((item, index) => {
      formCtrl.push(this.formBuilder.group({
        task: [item.task._id],
        element: [item.element._id],
        rating: [item.rating],
        frequency: [item.frequency],
        notes: [item.notes],
        photo: [item.photo],
        time: [item.time * 1000],
        duration: [item.duration],
        startTime: [item.startTime],
        endTime: [item.endTime]

      }));
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

  /* SETTING VALUES TO FORM FOR OFFLINE ENTRIES */
  initFormForOfflineData(data) {    
    if(data._id.indexOf('element') > -1) { 
      let studyTypes = [];
      if(data.efficiency_study == 1)
        studyTypes.push(1);
      if(data.activity_study == 1)
        studyTypes.push(2);
      if(data.role_study == 1)
        studyTypes.push(3);

      this.dataForm = this.formBuilder.group({
        name: [data.name],
        studyTypes: this.formBuilder.array(studyTypes),
        type: [data.type],
        rating: [data.rating],
        category: [data.category],
        addedBy:  this.formBuilder.group({
                    _id: [ data.userId ],
                    name :[data.addedby],
                    date : [data.date]
                  }),
        projectID: [data.projectID],
        status: [data.status],
        userAdded:[ data.userAdded ]
      })
    }
    /* FORM DATA FOR AREAS DOCUMENT */
    else{
    this.dataForm = this.formBuilder.group({ 
                    name: [data.name],
                    addedBy: this.formBuilder.group({
                                      _id: [data.id_of_addedby],
                                      name :[data.addedby],
                                      date : [data.date]
                                    }),
                    projectID: [data.projectID],
                    status:  [data.status]
                  })
  }
    
  }
  /* GETTING OFFLINE FORM */
  getFormForOfflineData(){
    return this.dataForm.value;
  }
}
