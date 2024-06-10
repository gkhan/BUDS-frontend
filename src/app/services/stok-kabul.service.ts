import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { IstokKabul } from '../interfaces/istokKabul';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StokKabulService {
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

  addStokKabulBelgesi(stkkbl:IstokKabul):Observable<IstokKabul>{
    return this.http.post<IstokKabul>("http://localhost:3000/api/stokKabul/ekle",stkkbl,this.httpOptions)
  }

  getStokKabulBelgeHepsi():Observable<IstokKabul[]>{
    return this.http.get<IstokKabul[]>("http://localhost:3000/api/stokKabul/hepsi",this.httpOptions)
  }
}
