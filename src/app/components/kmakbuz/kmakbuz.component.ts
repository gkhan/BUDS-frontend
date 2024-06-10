import { Component, OnInit } from '@angular/core';
import { Imakbuz } from 'src/app/interfaces/imakbuz';
import { MakbuzService } from 'src/app/services/makbuz.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-kmakbuz',
  templateUrl: './kmakbuz.component.html',
  styleUrls: ['./kmakbuz.component.css']
})
export class KmakbuzComponent implements OnInit{
  displayedColumns: string[] = ['tcNoVergiNo','isletmeAdiAdSoyad','makbuzTutari','urunler','makbuzDegistiren','makbuzAsamasi' ,'islem'];
  dataSource: any;

  constructor(
    public userService: UserService,
    public makbuzService: MakbuzService
    ){}


  ngOnInit(): void {
    this.tabloyuGuncelle();
  }

  //Makbuz Silmek için
  makbuzSil(_makbuz:Imakbuz){

    if(_makbuz._id!==undefined){
    this.makbuzService.deleteMakbuz(_makbuz._id)
    .subscribe(res=>{
      console.log(res)
      this.tabloyuGuncelle();
    })
  }


}

tabloyuGuncelle(){
  this.makbuzService.getMakbuzsByOlusturan()
  .subscribe(res=>{
    this.dataSource=res
  })
}

}
