import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { isayac } from '../interfaces/isayac';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SayacService {
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

  addSayac(sayac_:isayac):Observable<isayac>{
    return this.http.post<isayac>("http://localhost:3000/api/sayac/ekle",sayac_,this.httpOptions)
  }

  getSayacs():Observable<isayac[]>{
    return this.http.get<isayac[]>("http://localhost:3000/api/sayac/hepsi",this.httpOptions)
  }

  deleteSayac(_id:string):Observable<isayac>{
    return this.http.delete<isayac>("http://localhost:3000/api/sayac/sil/"+_id,this.httpOptions)
  }
  
  editSayac(_id:string,_sayac:isayac):Observable<isayac>{
    return this.http.put<isayac>("http://localhost:3000/api/sayac/degistir/"+_id,_sayac,this.httpOptions)
  }

  sayacDegeriArttir(_sayac:isayac):Observable<isayac>{
    return this.http.put<isayac>("http://localhost:3000/api/sayac/sayac-arttir",_sayac,this.httpOptions)

  }

  sayacAdiylaBul(_sayacAdi:string):Observable<isayac[]>{
    const arama ={
      search:_sayacAdi
    }
    return this.http.post<isayac[]>("http://localhost:3000/api/sayac/bul-ad",arama,this.httpOptions)
  }

  sayacAktifBolgeGetir(_sayacAdi:string):Observable<isayac>{
    const prmt ={
      sayacAdi:_sayacAdi
    }
    return this.http.post<isayac>("http://localhost:3000/api/sayac/bolge-aktif",prmt,this.httpOptions)

  }


  sayacAktifHaleGetir(_sayac:isayac){
    return this.http.post<isayac>("http://localhost:3000/api/sayac/aktiflestir",_sayac,this.httpOptions)

  }
  sayacPasifHaleGetir(_sayac:isayac){
    return this.http.post<isayac>("http://localhost:3000/api/sayac/pasiflestir",_sayac,this.httpOptions)

  }

}
