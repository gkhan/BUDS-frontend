import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iurun } from '../interfaces/iurun';
import { UserService } from './user.service';
import { Imakbuz } from '../interfaces/imakbuz';

@Injectable({
  providedIn: 'root'
})
export class MakbuzService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': this.userService.userData.token
    })
  };

  constructor(
    private http: HttpClient,
    public router: Router,
    public ngZone: NgZone,
    public userService: UserService
  ) { }

  getMakbuzs(): Observable<Imakbuz[]> {
    return this.http.get<Imakbuz[]>("http://localhost:3000/api/makbuz/hepsi", this.httpOptions)

  }
  getMakbuzsOdenmemis(): Observable<Imakbuz[]> {
    return this.http.put<Imakbuz[]>("http://localhost:3000/api/makbuz/odenmemis", this.userService.userData, this.httpOptions)

  }

  getMakbuzsByOlusturan():Observable<Imakbuz[]>{
    var pmtr ={
      makbuzKaydeden:this.userService.userData.kullaniciAdi
    }

    return this.http.post<Imakbuz[]>("http://localhost:3000/api/makbuz/belgeolusturan-belgeler",pmtr,this.httpOptions)

  }

  addMakbuz(_makbuz: Imakbuz): Observable<Imakbuz> {
    return this.http.post<Imakbuz>("http://localhost:3000/api/makbuz/ekle", _makbuz, this.httpOptions,)
  }

  deleteMakbuz(_id: string): Observable<Imakbuz> {
    return this.http.delete<Imakbuz>("http://localhost:3000/api/makbuz/sil/" + _id, this.httpOptions)
  }

  makbuzGonderimiTamamlandi() {
    this.router.navigate(["/kmakbuz"]);
  }

  editMakbuz(_id: string, _makbuz: Imakbuz): Observable<Imakbuz> {
    return this.http.put<Imakbuz>("http://localhost:3000/api/makbuz/degistir/" + _id, _makbuz, this.httpOptions);
  }


}
