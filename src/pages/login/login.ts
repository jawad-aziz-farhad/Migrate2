import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController,  NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider , ToastProvider, LoaderProvider } from '../../providers/index';
import { EMAIL_REGEXP, MESSAGE, ERROR } from '../../config/config';
import { ResetPasswordPage } from '../reset-password/reset-password';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  public loginForm: FormGroup;
  public pushPage: any;

  constructor(public navCtrl: NavController, 
              public authProvider: AuthProvider,
              private loader: LoaderProvider,
              private toast: ToastProvider,
              private formsBuilder: FormBuilder,
              private modalCtrl: ModalController) {

      this.initFormBuilder();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  /* INIT FORM CONTROLS */
  initFormBuilder(){
    this.pushPage = ResetPasswordPage;
    this.loginForm = this.formsBuilder.group({
      email: ['',  Validators.compose([Validators.maxLength(30), Validators.pattern(EMAIL_REGEXP), Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    })
  }

  /* LOGGIN IN USER */
  Login(value: any) {
    this.loader.showLoader(MESSAGE);
    this.authProvider
    .authenticate(this.loginForm.value)
    .finally(() => this.loader.hideLoader())
    .subscribe(res => {
      this.handleResponse(res);
    },
    err => {
      this.handleError(err)
    });
  }

  handleResponse(response: any){
    if(response.success == false )
      this.openModal(response.msg);
    else{
      this.authProvider._decodeUser(response.token).then(res => {
        this.handleJWT(response.token); 
      }).catch(error => {

      });
    }
        
  }

  handleJWT(token){
    this.authProvider.handleJWT(token).then(() => {
      console.log('LOGGED IN.');
    }).catch(error => {
      console.error('ERROR IN LOGGING IN.');
    });
  }
  
  /* SET USER INFO */
  setUserInfo(token){
    const decodedUser = this.authProvider.decodeUserFromToken(token);
    const user = this.authProvider.decodeUser(decodedUser);
    this.authProvider.setCurrentUser(user);
  }

  /* HANDLING LOGIN ERROR */
  handleError(error){
    if(error.success == false )
      this.openModal(error.msg);
    else
      this.toast.showToast(ERROR);
    
  }
  /* OPENING MODAL */
  openModal(error) {
    let modal = this.modalCtrl.create('AlertModalPage', {error: error, email: this.loginForm.value.email}, { cssClass: 'inset-modal login-error-modal' });
    modal.onDidDismiss(data => {
      if(data.action == 'reset_password')
        this.navCtrl.push(ResetPasswordPage);
      else
         console.log('User would like to TRY AGAIN.');  

    });

    modal.present();
  
  }

}
