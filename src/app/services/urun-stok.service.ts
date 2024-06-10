import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IurunStok } from '../interfaces/iurunStok';

@Injectable({
  providedIn: 'root'
})
export class UrunStokService {
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


  addBolgeyeStok(urunStok_:IurunStok):Observable<IurunStok>{
    return this.http.post<IurunStok>("http://localhost:3000/api/urunStok/ekle",urunStok_,this.httpOptions)
  }
  
  getUrunStoks():Observable<IurunStok[]>{
    return this.http.get<IurunStok[]>("http://localhost:3000/api/urunStok/hepsi",this.httpOptions)
  }


}
