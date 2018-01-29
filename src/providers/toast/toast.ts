import { Injectable } from '@angular/core';
import { Toast, ToastController } from 'ionic-angular';
/*
  Generated class for the ToastProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToastProvider {

  private toast: Toast;

  constructor(private readonly toastCtrl: ToastController) {
    console.log('Hello ToastProvider Provider');
  }

  /* SHOWING TOAST */
  showToast(message: string) {
      this.toast = this.toastCtrl.create({
        message,
        duration: 1000,
        position: 'middle'
      });
  
      this.toast.present();
  }

  showBottomToast(message){
    this.toast = this.toastCtrl.create({
      message,
      duration: 1000,
      position: 'bottom'
    });

    this.toast.present();
  }

}
