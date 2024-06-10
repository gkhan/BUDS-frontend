import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ikullanici } from '../interfaces/ikullanici';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userData: any;
  msg = "";
  isLogged = false;
  _baseUrl = "BDS";
  userService: any;

  
  constructor(
    private http: HttpClient,
    public router: Router,
    public ngZone: NgZone
  ) {

    this.userData = null;

  }


  LogIn(_username: string, _password: string) {

    var kullanici = {
      kullaniciAdi: _username,
      password: _password

    }
    //Gerek yok sanırım, user cookies e kaydedilecek*
    //this.logOut();
    if(_username ==="admin"){
    return this.http.post("http://localhost:3000/api/kullanici/login", kullanici, { observe: 'response' })
    }
    else{
      return this.http.post("http://localhost:3000/api/kullanici/login-domain",kullanici,{ observe: 'response' })
    }
      // .subscribe(response => {

      // if (response.status === 500) {
      //   this.msg = "Kullanıcı adı veya şifre hatalı";
      //   return response;
      // }
      // else if (response.status === 200) {
      //   this.userData = response.body;
      //   this.isLogged = true;
      //   localStorage.removeItem(this._baseUrl);
      //   localStorage.setItem(this._baseUrl, JSON.stringify(response.body));

      //   this.router.navigate(["/home"]);
      //   return response
      // }
      //   else
      //     return response;
      // }, error => {
      //   console.log("geçersiz token hatası", error);
      //   this.logOut();
      // }, () => {
      //   // console.log(this.dataSource);

      // }
      // )
      
      
  }

  //Her component önyüklemesinde çalıştırılması gereken cached'dekini getirme
  getProfile() {
    let cached: any;
    if (cached = localStorage.getItem(this._baseUrl)) {
      this.isLogged=true;
      this.userData=JSON.parse(cached);
      return JSON.parse(cached);
    } else {
      this.isLogged=false;
      return false;
    }
  }
  //Hatalı bir durumda user.logOut yapılması gerekiyor
  logOut() {
    localStorage.removeItem(this._baseUrl);
    this.isLogged = false;
    this.userData = null;

    this.router.navigateByUrl("/login");
  }

  getUsers(token:string){
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token':token
      })
    }; 

   return this.http.get("http://localhost:3000/api/kullanici/hepsi",httpOptions);    

  }

  addUser(_user:Ikullanici):Observable<Ikullanici>{
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token':this.userData.token
      })
    }; 

    return this.http.post<Ikullanici>("http://localhost:3000/api/kullanici/ekle",_user,httpOptions)
  }

  deleteUser(_id:string):Observable<Ikullanici>{
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token':this.userData.token
      })
    }; 

    return this.http.delete<Ikullanici>("http://localhost:3000/api/kullanici/sil/"+_id,httpOptions)
  }



}
