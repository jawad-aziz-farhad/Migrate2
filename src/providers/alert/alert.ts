import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the AlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AlertProvider {

  public isPresent: boolean = false;

  constructor(private alertCtrl: AlertController) {
    console.log('Hello AlertProvider Provider');
  }
  
  /* SHOWING CONFIRMATION ALERT */
  presentConfirm(title: string, message: string ) {

    return new Promise((resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: title,
        message: message,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.isPresent = false;
              resolve('cancel');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.isPresent = false;
              resolve('yes');
            }
          }
        ]
      });
      
      this.isPresent = true;
      alert.present();

    });
    
  }
  /* SHOWING ALERT */
  showAlert(title: string,message: string): void {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            console.log('ALERT CLOSED');
          }
        }
      ]
    });
    
    alert.present();
  }

  

}
