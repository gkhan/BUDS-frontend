import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { ikasa } from '../interfaces/ikasa';


@Injectable({
  providedIn: 'root'
})
export class KasaService {
  kasaData:any;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token':this.userService.userData.token
    })
  }; 

  constructor(
    private http: HttpClient,
    public router:Router,
    public ngZone:NgZone,
    public userService: UserService
  ) { }

  aktifKasayiGetir():Observable<any>{
   return this.http.post<ikasa>("http://localhost:3000/api/kasa/aktif",this.userService.userData,this.httpOptions)
    
  }

  kasayiGuncelle(_id:string,_kasa:ikasa):Observable<ikasa>{
    return this.http.put<ikasa>("http://localhost:3000/api/kasa/degistir/"+_id,_kasa,this.httpOptions)
  }
}
