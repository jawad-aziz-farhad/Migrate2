import { Injectable } from '@angular/core';
import { Http , Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { ReplaySubject, Observable } from "rxjs";
import { Storage } from "@ionic/storage";
import { JwtHelper, AuthHttp } from "angular2-jwt";
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
  public currentUser = { _id: '', username: '', role: '', firstname:'', lastname:'', email:'', status:'', userpermission:'' , userimage: ''};
  public authUser = new ReplaySubject<any>(1);
  
  constructor(private readonly http: Http, 
              private readonly authHttp: AuthHttp,
              private readonly storage: Storage,
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
    .map(jwt => jwt);
;    
  }
  
  handleJWT(jwt: string) {
    return this.storage.set('jwt', jwt).then(() => this.authUser.next(jwt)).then(jwt => jwt);
  }

  _decodeUser(token: any): Promise<any> {
      const decodedUser =  this.decodeUserFromToken(token);
      const user = this.decodeUser(decodedUser);
      return this.storage.set('currentUser', user);
  }
  decodeUserFromToken(jwt: string){
    return this.jwtHelper.decodeToken(jwt).user;
  }

  logOut(){
    // this.storage.remove('jwt').then(() => this.authUser.next(null));
    this.storage.remove('jwt').then(() => {
       this.storage.remove('currentUser').then(() => this.authUser.next(null));
    });
  }  

  resetPassword(email){
    this.END_POINT = SERVER_URL + 'users/resetPassword';
    return this.http.post(this.END_POINT, email, { headers: this.headersProvider.getHeaders()}).map(res => res.json());
  }

  decodeUser(decodedUser) {
    this.currentUser._id = decodedUser._id;
    this.currentUser.username = decodedUser.username;
    this.currentUser.firstname = decodedUser.firstname;
    this.currentUser.lastname = decodedUser.lastname;
    this.currentUser.email = decodedUser.email;
    this.currentUser.userimage = decodedUser.userimage;
    this.currentUser.status = decodedUser.status;
    this.currentUser.role = decodedUser.role;
    this.currentUser.userpermission = decodedUser.userpermission;
    
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

  getJwt(){
    return this.storage.get('jwt').then(jwt => {
        return jwt;
    }).catch(error => {
       return error 
    });
  }
}
