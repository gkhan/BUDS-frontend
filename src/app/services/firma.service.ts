import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ifirma } from '../interfaces/ifirma';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FirmaService {

  firmalar:ifirma[]=[]

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
  ) { 
    this.getFirmalar().subscribe(res=>{
      this.firmalar=res;
    })


  }

    getFirmalar():Observable<ifirma[]>{
    return this.http.get<ifirma[]>("http://localhost:3000/api/firma/hepsi",this.httpOptions);
   }
    addFirma(firma_:ifirma):Observable<ifirma>{
      return this.http.post<ifirma>("http://localhost:3000/api/firma/ekle",firma_,this.httpOptions)
    }

    getFirmasByTcVergiNo(search:String):Observable<ifirma[]>{
      const arama ={
        search:search
      }
      return this.http.post<ifirma[]>("http://localhost:3000/api/firma/bul-tcvergi",arama,this.httpOptions)
    }

    getFirmasByAd(search:String):Observable<ifirma[]>{
      const arama ={
        search:search
      }
      return this.http.post<ifirma[]>("http://localhost:3000/api/firma/bul-ad",arama,this.httpOptions)
    }

    deleteFirma(_id:String):Observable<ifirma>{
      return this.http.delete<ifirma>("http://localhost:3000/api/firma/sil/"+_id,this.httpOptions)
    }



}
