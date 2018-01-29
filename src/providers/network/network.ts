import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Observable } from 'rxjs';

declare var navigator: any;
declare var Connection: any;

/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkProvider {

  constructor(public network: Network) {
    console.log('Hello NetworkProvider Provider');
  }

    
  isConnected(): Observable<any> {
    return this.network.onConnect();
  }

  isInternetAvailable(): boolean {
    if(navigator.connection.type == Connection.NONE)
      return false;
    else
      return true;  
  }

  

}
