import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirmaService } from 'src/app/services/firma.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-firma',
  templateUrl: './firma.component.html',
  styleUrls: ['./firma.component.css']
})
export class FirmaComponent implements OnInit{

  displayedColumns: string[] = ['tcNoVergiNo', 'adSoyadFirmaAd','adres','firmaAktifMi'];
  dataSource: any;


  constructor(
    private formBuilder: FormBuilder,
    public userService: UserService,
    public firmaService:FirmaService

  ) {     
  }
  ngOnInit(): void {
    this.form.controls["firmaAktifMi"].setValue(true);

    this.firmaService.getFirmalar()
    .subscribe({
      next: (v) => {
        this.dataSource=v
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

  form: FormGroup = this.formBuilder.group({
    tcNoVergiNo: ['', Validators.required],
    adSoyadFirmaAd: ['', Validators.required],
    adres: ['', Validators.required],
    firmaAktifMi:['', Validators.required]

  });

//Form Gönderme
//Bütün Gönderme Kontrolleri Burada Yapılacak
//TC kimlik ve isim yenilenmeleri
//Yetki Kontrolleri Burada Kontrol Edilecek
  onSubmit(){
    console.log("Submit Çalışıyor")

    const fir_ ={
      tcNoVergiNo:this.form.controls["tcNoVergiNo"].value,
      adSoyadFirmaAd:this.form.controls["adSoyadFirmaAd"].value,
      firmaAktifMi:this.form.controls["firmaAktifMi"].value,
      adres:this.form.controls["adres"].value,
      firmaKaydeden:this.userService.userData.kullaniciAdi
    }
    try {
      this.firmaService.addFirma(fir_)
      .subscribe({
        next: (v) => {
          console.log(v.adSoyadFirmaAd+" Adlı Firma Eklendi")
          

        },
        error: (e) => {
          console.log("geçersiz token hatası", e);
          this.userService.logOut();
  
        },
        complete: () => {
          console.info('complete')
          this.firmaService.getFirmalar()
          .subscribe({
          next: (t) => {
          this.dataSource=t
          },
          error: (e) => {
          console.log("geçersiz token hatası", e);
          this.userService.logOut();

          },
          complete: () => {
          console.info('complete')
          }})
        }
  
      })
    } catch (error) {
      console.log(error)
    }

  }

  //Eğer Aktiflikle alakalı bir kontrol olursa burada belirtilecek
  firmaAktifMi(){
    //console.log(this.form.controls["firmaAktifMi"].value)
  }
}
