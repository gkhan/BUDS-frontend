import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ikasabolge } from 'src/app/interfaces/ikasabolge';
import { isayac } from 'src/app/interfaces/isayac';
import { BolgebirimService } from 'src/app/services/bolgebirim.service';
import { SayacService } from 'src/app/services/sayac.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sayac',
  templateUrl: './sayac.component.html',
  styleUrls: ['./sayac.component.css']
})
export class SayacComponent implements OnInit{
  displayedColumns: string[] = ['sayacAdi','sayacAraligiSeriNo','sayacDegeri','sayacGuncellemeTarihi','sayacAraligiBaslangic','sayacAraligiBitis', 'islem'];
  dataSource: any;
  bolgeListesi:Array<ikasabolge> = [];
  sayacAdi:string="hepsi";



  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    public sayacService:SayacService,
    public userService:UserService,
    public dialog: MatDialog,
    public bolgebirimService:BolgebirimService
  ) {}

   ngOnInit(): void {

    this.sayacService.getSayacs()
    .subscribe({
      next: (v) => {
        this.dataSource = new MatTableDataSource(v);
      },
      error: (e) => {
        console.log("geçersiz token hatası", e);
        this.userService.logOut();

      },
      complete: () => {
        console.info('complete')
      }

    })

    this.bolgebirimService.getKasaBolges()
    .subscribe({
      next: (v) => {
        this.bolgeListesi = v;
      },
      error: (e) => {
        console.log("geçersiz token hatası", e);
        this.userService.logOut();

      },
      complete: () => {
        console.info('complete')
      }

    })
    
  }
  

  //Dialog açılması ve kapanırken listenin yenilenmesi---
  openDialog(): void {  
    const dialogRef = this.dialog.open(sayacEkleDialog, {
      width: 'inherit'
    });

    dialogRef.afterClosed()
       .subscribe({
          next:(v)=>{
            this.sayacService.getSayacs()
            .subscribe(res => {
              this.dataSource = new MatTableDataSource(res);
              this.table.renderRows();
            });
          }
    }
      
    );
  }

  //edit dialogu açılıp kapanırken listenin yenilenmesi için
  editDialog(el:isayac):void{
    const dialogRef = this.dialog.open(sayacDegistirDialog, {
      width: 'inherit'
    });
    dialogRef.componentInstance.sayacGetir(el);//sayacı getir

    dialogRef.afterClosed()
       .subscribe({
          next:(v)=>{
            if(this.sayacAdi==="hepsi"){
              this.sayacService.getSayacs()
              .subscribe({
                next: (v) => {
                  this.dataSource = new MatTableDataSource(v);
                },
                error: (e) => {
                  console.log("geçersiz token hatası", e);
                  this.userService.logOut();
          
                },
                complete: () => {
                  console.info('complete')
                }
          
              })
            }
            else{
              this.sayacService.sayacAdiylaBul(this.sayacAdi)
                 .subscribe({
                     next: (v) => {
                       this.dataSource = new MatTableDataSource(v);
                        this.table.renderRows();
                   },
                  error: (e) => {
                       console.log("geçersiz token hatası", e);
                      this.userService.logOut();
        
                   },
                  complete: () => {
                 console.info('complete')
              } 
        
            })
          }
          }
    }
      
    );
  }
  //Silinme İşlemini Gerçekleştirirken Sayacın Arşiv ve Aktif olup olmadığı kontrol edilecek.
  //Sayaç Silinmesi için gerekli işlemler ve silinmesi
  sayacSil(el:isayac){

  }
  sayacAdiSec(){
    //Bölge Seçilince Bölgeye Ait Sayaçlar Gelir
    if(this.sayacAdi==="hepsi"){
      this.sayacService.getSayacs()
      .subscribe({
        next: (v) => {
          this.dataSource = new MatTableDataSource(v);
        },
        error: (e) => {
          console.log("geçersiz token hatası", e);
          this.userService.logOut();
  
        },
        complete: () => {
          console.info('complete')
        }
  
      })
    }
    else{
      this.sayacService.sayacAdiylaBul(this.sayacAdi)
         .subscribe({
             next: (v) => {
               this.dataSource = new MatTableDataSource(v);
                this.table.renderRows();
           },
          error: (e) => {
               console.log("geçersiz token hatası", e);
              this.userService.logOut();

           },
          complete: () => {
         console.info('complete')
      } 

    })
  }
  }
  sayaclariGetir(_bolge:ikasabolge){
    this.sayacService.sayacAdiylaBul(_bolge.kasaBolgeAdi)
    .subscribe({
      next: (v) => {
        this.dataSource = new MatTableDataSource(v);
        this.table.renderRows();
      },
      error: (e) => {
        console.log("geçersiz token hatası", e);
        this.userService.logOut();

      },
      complete: () => {
        console.info('complete')
      }

    })
  }

  //SayaçArşivle ve Arşivden çıkar
  sayacArsivle(el:isayac){

  }
  sayacArsivAc(el:isayac){

  }
  sayacPasiflestir(el:isayac){

    this.sayacService.sayacPasifHaleGetir(el)
    .subscribe({
      next: (v) => {
        console.log(v);
      },
      error: (e) => {
        console.log("geçersiz token hatası", e);
        this.userService.logOut();

      },
      complete: () => {
        console.info('complete');
        this.sayacAdiSec();
      }

    })
  }
  sayacAktiflestir(el:isayac){
    this.sayacService.sayacAktifHaleGetir(el)
    .subscribe({
      next: (v) => {
        console.log(v);
      },
      error: (e) => {
        console.log("geçersiz token hatası", e);
        this.userService.logOut();

      },
      complete: () => {
        console.info('complete')
        this.sayacAdiSec();
      }

    })
  }

}
//Sayaç Ekleme Dialogu --------------------------------------------
@Component({
  selector: 'sayacEkleDialog',
  templateUrl: 'sayacEkleDialog.html',
})
export class sayacEkleDialog implements OnInit{
  sayacAktifMi:boolean=false;
  sayacAdi:string="";
  bolgeListesi:any;
  form: FormGroup = this.formBuilder.group({
    sayacAraligiSeriNo:['',Validators.required],
    sayacAraligiBaslangic: ['', Validators.required],
    sayacAraligiBitis: ['', Validators.required]

  });

  constructor(
    public dialogRef: MatDialogRef<sayacEkleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: isayac,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public sayacService: SayacService,
    public bolgebirim:BolgebirimService

  ) { }
  ngOnInit(): void {
    this.bolgebirim.getKasaBolges()
    .subscribe({
      next: (v) => {
        this.bolgeListesi = v;
      },
      error: (e) => {
        console.log("geçersiz token hatası", e);
        this.userService.logOut();

      },
      complete: () => {
        console.info('complete')
      }

    })
    
  }

  onSubmit(){
    if(this.form.invalid){
      return
    }

    //console.log("Sayaç Oluşturuluyor")
    if(this.userService.isLogged){
      var sayacEkle ={
        sayacAdi:this.sayacAdi,
        sayacOlusturan:this.userService.userData.kullaniciAdi,
        sayacAraligiSeriNo:this.form.controls["sayacAraligiSeriNo"].value,
        sayacAraligiBaslangic:this.form.controls["sayacAraligiBaslangic"].value,
        sayacAraligiBitis:this.form.controls["sayacAraligiBitis"].value
      }

      this.sayacService.addSayac(sayacEkle)
      .subscribe({
        next: (v) => {
        },
        error: (e) => {
          console.log("geçersiz token hatası", e);
          this.userService.logOut();
  
        },
        complete: () => {
          console.info('complete')
          this.dialogRef.close();
        }
  
      })
    }

  }
  sayacAdiSec(){
    console.log(this.sayacAdi)
  }
  sayacAktifMiSec(){
    console.log(this.sayacAktifMi)
  }
  

}
//Sayaç Düzenleme Dialogu-------------------------------------------
@Component({
  selector: 'sayacDegistirDialog',
  templateUrl: 'sayacDegistirDialog.html',
})
export class sayacDegistirDialog implements OnInit{
  form: FormGroup = this.formBuilder.group({
    sayacAraligiSeriNo: ['', Validators.required],
    sayacAraligiBaslangic: ['', Validators.required],
    sayacAraligiBitis: ['', Validators.required]

  });
  sayacAdi: string="";
  degistirilenSayacId:string="";
  sayacAktifMi:boolean=false;
  bolgeListesi:any;


  constructor(
    public dialogRef: MatDialogRef<sayacDegistirDialog>,
    @Inject(MAT_DIALOG_DATA) public data: isayac,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public sayacService: SayacService,
    public bolgebirim:BolgebirimService


  ) { }
  ngOnInit(): void {
    this.bolgebirim.getKasaBolges()
    .subscribe({
      next: (v) => {
        this.bolgeListesi = v;
      },
      error: (e) => {
        console.log("geçersiz token hatası", e);
        this.userService.logOut();

      },
      complete: () => {
        console.info('complete')
      }

    })
    
  }

  onSubmit(){
    if(this.form.invalid){
      return
    }
    if(this.userService.isLogged){
      var sayacDegistir ={
        sayacAdi:this.sayacAdi,
        sayacDegistiren:this.userService.userData.kullaniciAdi,
        sayacAraligiSeriNo:this.form.controls["sayacAraligiSeriNo"].value,
        sayacAraligiBaslangic:this.form.controls["sayacAraligiBaslangic"].value,
        sayacAraligiBitis:this.form.controls["sayacAraligiBitis"].value,
        sayacAktifMi:this.sayacAktifMi
      }
      console.log("ses: " +this.degistirilenSayacId)
      this.sayacService.editSayac(this.degistirilenSayacId,sayacDegistir)
      .subscribe({
        next: (v) => {
          console.log(v)
        },
        error: (e) => {
          console.log("geçersiz token hatası", e);
          this.userService.logOut();
  
        },
        complete: () => {
          console.info('complete')
          this.dialogRef.close();
        }
  
      })

  }


}

  sayacGetir(s_:isayac){
    //console.log(urun);
    this.sayacAdi =s_.sayacAdi;

    if(s_._id!==undefined){
    this.degistirilenSayacId=s_._id;
  }
    this.form.controls["sayacAraligiSeriNo"].setValue(s_.sayacAraligiSeriNo);
    this.form.controls["sayacAraligiBaslangic"].setValue(s_.sayacAraligiBaslangic);
    this.form.controls["sayacAraligiBitis"].setValue(s_.sayacAraligiBitis);
  }
  sayacAdiSec(){
    console.log(this.sayacAdi)
  }

}