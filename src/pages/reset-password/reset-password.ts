import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider , ToastProvider, LoaderProvider } from '../../providers/index';
import { EMAIL_REGEXP , MESSAGE} from '../../config/config';

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ 
  name: 'reset-password',
  defaultHistory: ['LoginPage']
})
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

  public resetPWForm: FormGroup;
  public emailSENT: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public formBuilder: FormBuilder ,
              public authProvider: AuthProvider ,
              public toast: ToastProvider,
              public loader: LoaderProvider) {

      this.initFormBuilder();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
    
  }

  /* INIT FORM CONTROLS */
  initFormBuilder() {
        this.emailSENT = false;
        this.resetPWForm = this.formBuilder.group({
          email: ['',  Validators.compose([Validators.maxLength(30), Validators.pattern(EMAIL_REGEXP), Validators.required])]
        })
  }

  submitForm(){
      this.loader.showLoader(MESSAGE);
      this.authProvider.resetPassword(this.resetPWForm.value).subscribe(res => {
        this.loader.hideLoader();
        this.emailSENT = true;
        console.log('PASSWORD RESET RESPONSE: ' + JSON.stringify(res));
      },
     error => {
        this.loader.hideLoader();
        let _error = JSON.parse(error._body);
        this.handleError(_error);
     });
  }

   /* HANDLING LOGIN ERROR */
   handleError(error){
    this.toast.showToast(error.error);
  }
  

}
