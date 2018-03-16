import { Injectable } from '@angular/core';
import { Http , Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { ReplaySubject, Observable } from "rxjs";
import { Storage } from "@ionic/storage";
import { JwtHelper } from "angular2-jwt";
import { SERVER_URL } from '../../config/config';
import { HeadersProvider } from '../headers/headers';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  
  public END_POINT: any;
  public currentUser = { _id: '', username: '', firstname:'', lastname:'', email:'', status:'',  userimage: ''};
  public authUser = new ReplaySubject<any>(1);
  
  constructor(private readonly http: Http, 
              private storage: Storage,
              private readonly jwtHelper: JwtHelper,
              private readonly headersProvider: HeadersProvider) {
  }

  checkLogin(){
    this.storage.get('jwt').then(jwt => {

        if(jwt && !this.jwtHelper.isTokenExpired(jwt)){
            this.authUser.next(jwt);
        }
        else
          this.storage.remove(jwt).then(() => this.authUser.next(null));
    });
  }

  authenticate(credentials: any): Observable<any> {
    this.END_POINT = SERVER_URL + 'users/authenticate/app';
    return this.http.post(`${this.END_POINT}`, credentials)
    .map(res => res.json())
    .map(jwt => jwt)
    .catch(this.handleError);
    
  }

   handleError(error: Response) {
     return Observable.throw(error.json());
   }
  
  handleJWT(jwt: string) {
    localStorage.setItem('TOKEN',jwt);
    return this.storage.set('jwt', jwt).then(() => this.authUser.next(jwt)).then(jwt => jwt);
  }

  _decodeUser(token: any): Promise<any> {
      const decodedUser =  this.decodeUserFromToken(token);
      const user = this.decodeUser(decodedUser);
      localStorage.setItem("userID", user._id);
      return this.storage.set('currentUser', user);
  }
  decodeUserFromToken(jwt: string){
    return this.jwtHelper.decodeToken(jwt).user;
  }

  logOut(){
    this.storage.remove('jwt').then(() => {
       localStorage.removeItem('TOKEN');
       localStorage.removeItem("userID");
       this.storage.remove('currentUser').then(() => this.authUser.next(null));
    });
  }  

  resetPassword(email){
    this.END_POINT = SERVER_URL + 'users/requestPasswordReset';
    return this.http.post(this.END_POINT, email, { headers: this.headersProvider.getHeaders()}).map(res => res.json());
  }

  decodeUser(decodedUser) {
    this.currentUser._id = decodedUser._id;
    this.currentUser.username = decodedUser.username;
    this.currentUser.firstname = decodedUser.name;
    this.currentUser.lastname = decodedUser.lastName;
    this.currentUser.email = decodedUser.email;
    if(decodedUser.userimage)
      this.currentUser.userimage = decodedUser.userimage;
    else
      this.currentUser.userimage = null;
    this.currentUser.status = decodedUser.status;
    return this.currentUser;
  }

  setCurrentUser(currentUser){
     this.storage.set('currentUser', currentUser);
  }

  getCurrentUser() {
    this.storage.get('currentUser').then(currentUser => {
        this.authUser.next(currentUser);
    });
  }

}
