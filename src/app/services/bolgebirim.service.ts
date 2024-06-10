import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ikasabolge } from '../interfaces/ikasabolge';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BolgebirimService {

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

  addKasaBolge(kasabolge:ikasabolge):Observable<ikasabolge>{
    return this.http.post<ikasabolge>("http://localhost:3000/api/kasabolge/ekle",kasabolge,this.httpOptions)
  }

  getKasaBolges():Observable<ikasabolge[]>{
    return this.http.get<ikasabolge[]>("http://localhost:3000/api/kasabolge/hepsi",this.httpOptions)
  }

  deleteKasaBolge(_id:String):Observable<ikasabolge>{
    return this.http.delete<ikasabolge>("http://localhost:3000/api/kasabolge/sil/"+_id,this.httpOptions)
  }
  editKasaBolge(_id:string,_kasabolge:ikasabolge):Observable<ikasabolge>{
    return this.http.put<ikasabolge>("http://localhost:3000/api/kasabolge/degistir/"+_id,_kasabolge,this.httpOptions)
  }

}
