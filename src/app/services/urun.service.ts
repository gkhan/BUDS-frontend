import { Injectable,NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iurun } from '../interfaces/iurun';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class UrunService {

  urunler:Iurun[]=[];

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
      
    }

    getUrunler():Observable<Iurun[]>{          

     return this.http.get<Iurun[]>("http://localhost:3000/api/urun/hepsi",this.httpOptions);
    }

    deleteUrun(_id:string):Observable<Iurun>{

      return this.http.delete<Iurun>("http://localhost:3000/api/urun/sil/"+_id,this.httpOptions)
    }

    addUrun(urun:Iurun):Observable<Iurun>{
      return this.http.post<Iurun>("http://localhost:3000/api/urun/ekle",urun,this.httpOptions)
    }

    editUrun(_id:string,urun:Iurun):Observable<Iurun>{
      return this.http.put<Iurun>("http://localhost:3000/api/urun/degistir/"+_id,urun,this.httpOptions)
    }

    getUrunBul(search:string):Observable<Iurun[]>{

      const arama ={
        search:search
      }

     return this.http.post<Iurun[]>("http://localhost:3000/api/urun/bul",arama,this.httpOptions)

    }
    getUrunBulurunKodu(search:string):Observable<Iurun[]>{

      const arama ={
        search:search
      }

     return this.http.post<Iurun[]>("http://localhost:3000/api/urun/bul-kod",arama,this.httpOptions)

    }


}
