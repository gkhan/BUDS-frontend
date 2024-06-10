import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ikasabolge } from 'src/app/interfaces/ikasabolge';
import { BolgebirimService } from 'src/app/services/bolgebirim.service';
import { UserService } from 'src/app/services/user.service';
import { makbuzOlusturmaDialog } from '../makbuz/makbuz.component';
import { Observable, startWith } from 'rxjs';
import { Iurun } from 'src/app/interfaces/iurun';
import { UrunService } from 'src/app/services/urun.service';
import { StokKabulService } from 'src/app/services/stok-kabul.service';
import { UrunStokService } from 'src/app/services/urun-stok.service';

@Component({
  selector: 'app-stokkabul',
  templateUrl: './stokkabul.component.html',
  styleUrls: ['./stokkabul.component.css'],
})
export class StokkabulComponent implements OnInit {
  displayedColumns: string[] = [
    'stokBolge',
    'urunAdi',
    'adet',
    'seriNo',
    'kimTarafindanOlusturuldu',
    'olusturulmaTarihi',
    'islem',
  ];
  dataSource1: any;
  loading:boolean=false

  constructor(
    public userService: UserService,
    public dialog: MatDialog,
    public bolgebirimService: BolgebirimService,
    public stokkabulService:StokKabulService,
    public urunstokService:UrunStokService
  ) {}

  ngOnInit(): void {
    this.loading=true;
    this.stokkabulService.getStokKabulBelgeHepsi()
        .subscribe(res => {
          this.dataSource1 = res
          this.loading=false
        });

  }

  openDialog(): void {
    this.loading=true;
    const dialogRef = this.dialog.open(stokkabulOlusturmaDialog, {
      width: 'inherit',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.stokkabulService.getStokKabulBelgeHepsi()
        .subscribe(res => {
          this.dataSource1 = res
          this.loading=false
        });
    });
  }
}

@Component({
  selector: 'stokkabulOlusturmaDialog',
  templateUrl: 'stokkabulOlusturmaDialog.html',
  styleUrls: ['./stokkabul.component.css'],
})
export class stokkabulOlusturmaDialog implements OnInit {
  bolgeListesi: Array<ikasabolge> = [];
  bolgeAdi: string = '';
  filteredUruns: Array<Iurun> = [];
  selectedUrun: any;
  loading:boolean=false;

  form: FormGroup = this.formBuilder.group({
    urunAdi: ['', Validators.required],
    adet: ['', Validators.min(1)],
    seriNo: ['', Validators.minLength(4)],
    urun: [''],
    urunKodu: [''],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<makbuzOlusturmaDialog>,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public urunService: UrunService,
    public bolgebirimService: BolgebirimService,
    public stokkabulService:StokKabulService,
    public urunstokService:UrunStokService
  ) {}
  ngOnInit(): void {
    this.form.controls['urun'].valueChanges.pipe().subscribe((_urun) => {
      this.urunService.getUrunBul(_urun).subscribe((res: any[]) => {
        //console.log(res)
        this.filteredUruns = res;
        _urun = res;
      });
    });

    this.form.controls['urunKodu'].valueChanges.pipe().subscribe((_urun) => {
      this.urunService.getUrunBulurunKodu(_urun).subscribe((res: any[]) => {
        //console.log(res)
        this.filteredUruns = res;
        _urun = res;
      });
    });

    this.bolgebirimService.getKasaBolges().subscribe({
      next: (v) => {
        this.bolgeListesi = v;
      },
      error: (e) => {
        console.log('geçersiz token hatası', e);
        this.userService.logOut();
      },
      complete: () => {
        console.info('complete');
      },
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.loading=true;

    if(this.form.controls['urun'].value === this.selectedUrun.urunAdi){
      //console.log("Başarılı")
      var stkkbl ={
        urunID:this.selectedUrun._id,
        urunAdi:this.selectedUrun.urunAdi,
        belgeGirisMi:true,
        stokBolge:this.bolgeAdi,
        adet:this.form.controls['adet'].value,
        kimTarafindanOlusturuldu:this.userService.userData.kullaniciAdi,
        kimTarafindanGuncellendi:this.userService.userData.kullaniciAdi,
        seriNo:this.form.controls['seriNo'].value
      }

      this.stokkabulService.addStokKabulBelgesi(stkkbl)
      .subscribe({
        next:(v)=>{
          var urunstk ={
            urunID:v.urunID,
            urunAdi:v.urunAdi,
            stok:v.adet,
            stokBolge:v.stokBolge,
            kimTarafindanOlusturuldu:this.userService.userData.kullaniciAdi,
            kimTarafindanGuncellendi:this.userService.userData.kullaniciAdi,
            aktifMi:true
          }

          this.urunstokService.addBolgeyeStok(urunstk)
          .subscribe({
            next:(s)=>{

              console.log(s.stokBolge+" Adlı Bölgeye"+ v.adet+" kadar "+ v.urunAdi+" "+ v.kimTarafindanGuncellendi+" tarafından eklenmiştir");

            },
            error:(e)=>{
              console.log('geçersiz token hatası', e);
              this.userService.logOut();
            },
            complete:()=>{

            }
          })


        },
        error:(e)=>{

        console.log('geçersiz token hatası', e);
        this.userService.logOut();
        },
        complete:()=>{
          this.dialogRef.close();
        }

      })


    }
    else{
      this.loading=false;
      return
    }



  }

  urunSec(_urun: Iurun) {
    this.selectedUrun = _urun;
    this.form.controls['urun'].setValue(_urun.urunAdi);
    this.form.controls['urunKodu'].setValue(_urun.urunKodu);
  }
}
