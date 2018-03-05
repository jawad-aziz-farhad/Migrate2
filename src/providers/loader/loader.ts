import { Injectable } from '@angular/core';
import { LoadingController , Loading} from 'ionic-angular';

/*
  Generated class for the LoaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoaderProvider {
  
  private loading: Loading;

  constructor(private readonly loadingCtrl: LoadingController,) {
    console.log('Hello LoaderProvider Provider');
  }
  
  /* SHOWING LOADER */
  showLoader(content: string){
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: content
    });

    this.loading.present();
  }

  /* HIDING LAOADER */
  hideLoader(){
    this.loading.dismiss();
  }

}
