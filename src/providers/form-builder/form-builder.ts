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
      role: data.role._id,
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
        time: [item.time * 1000]
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

  //initFormForOfflineData(data){
    //   let formData = null;
    //   /* FORM DATA FOR ROLES DOCUMENT */
    //   if(data.position)
    //     formData = {
    //       name: data.name,
    //       position: data.position,
    //       addedBy:  this.formBuilder.group({
    //         _id: data.id_of_addedby,
    //         name :data.addedby,
    //         date : data.dateadded
    //       }),
    //       status: data.status,
    //       projectID: data.projectID
    //     }
      
    //   /* FORM DATA FOR ELEMENTS DOCUMENT */
    //   else if(data.types){
    //     let studyTypes = [];
    //     if(data.efficiency_study == 1)
    //       studyTypes.push[1];
    //     if(data.activity_study)
    //       studyTypes.push[2];
    //     if(data.role_study)
    //       studyTypes.push(3);

    //     formData = {
    //       name: data.name ,
    //       studyTypes: studyTypes,
    //       type: data.type,
    //       rating: data.rating,
    //       category: data.category,
    //       addedBy:  this.formBuilder.group({
    //                               _id: data.id_of_addedby,
    //                               name :data.addedby,
    //                               date : data.dateadded
    //                             }),
    //       projectID: data.projectID,
    //       status: data.status,
    //       userAdded: data.userAdded
    //     }
    //   }
    //   /* FORM DATA FOR AREAS DOCUMENT */
    //   else
    //   formData = 
    //   { name: data.name,
    //     addedBy:  this.formBuilder.group({
    //                   _id: data.id_of_addedby,
    //                   name :data.addedby,
    //                   date : data.dateadded
    //                 }),
    //     projectID: data.projectID,
    //     status:  data.status
    //   }

    // this.dataForm = this.formBuilder.group(formData);
  // }

  // getFormForOfflineData(){
  //   return this.dataForm;
  // }


  /* SETTING VALUES TO FORM FOR OFFLINE ENTRIES */
  initFormForOfflineData(data) {    
    /* FORM DATA FOR ROLES DOCUMENT */
    if(data.position)
      this.dataForm = this.formBuilder.group({
        name: [data.name],
        position: [data.position],
        addedBy:  this.formBuilder.group({
          _id: [data.id_of_addedby],
          name :[data.addedby],
          date : [data.date]
        }),
        status: [data.status],
        projectID: [data.projectID]
      })
    
    /* FORM DATA FOR ELEMENTS DOCUMENT */
    else if(data._id.indexOf('element') > -1) { 
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
