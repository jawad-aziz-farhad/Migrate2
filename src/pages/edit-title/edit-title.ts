import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ViewController} from 'ionic-angular';
import { ParserProvider, OperationsProvider , FormBuilderProvider } from '../../providers';
/**
 * Generated class for the EditTitlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-title',
  templateUrl: 'edit-title.html',
})
export class EditTitlePage {

  public studyTitle: string;
  private data: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public parser: ParserProvider,
              public operations: OperationsProvider,
              public formBuilder: FormBuilderProvider) {
    this.init();
  }

  init(){
    this.data = this.navParams.get('data');
    console.log("Data is: "+ JSON.stringify(this.data))
    this.studyTitle = this.navParams.get('title');
    if(this.data)
      this.studyTitle = this.data.name;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditTitlePage');
  }

  ionViewWillEnter(){
  }

  checking(value: string){
    if(this.data)
      this.updateName();
    else
      this.dismiss(value)
      
  }

  dismiss(value: string){
    let parser = this.parser.geAllData();
    parser.setTitle(this.studyTitle);
    this.viewCtrl.dismiss();
  }

  updateName(){
    this.data.name = this.studyTitle;
    this.formBuilder.initFormForOfflineData(this.data);
    const data     = this.formBuilder.getFormForOfflineData().value;
    this.operations.offlineRequest(this.getEndPoint(), data).subscribe(result => {
      if(result.success){
        result.updatedName = this.studyTitle;
        this.viewCtrl.dismiss({ data: result });
      }
      else
        this.operations.handleError(result);  
    },
    error => console.log("ERROR: " + JSON.stringify(error)));
  }

  getEndPoint(){
    let endPoint = null;
    if(this.data.position)
        endPoint = 'roles/add';
    else if(this.data.type)
       endPoint = 'elements/add';
    else
      endPoint = 'areas/add';
    return endPoint;  
  }


}
