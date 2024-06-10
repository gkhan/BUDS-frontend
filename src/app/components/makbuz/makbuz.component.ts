import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Iurun } from 'src/app/interfaces/iurun';
import { UrunService } from 'src/app/services/urun.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Imakbuz } from 'src/app/interfaces/imakbuz';
import { MatPaginator } from '@angular/material/paginator';
import { MakbuzService } from 'src/app/services/makbuz.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, observable, Observable, startWith } from 'rxjs';
import { ifirma } from 'src/app/interfaces/ifirma';
import { FirmaService } from 'src/app/services/firma.service';

@Component({
  selector: 'app-makbuz',
  templateUrl: './makbuz.component.html',
  styleUrls: ['./makbuz.component.css']
})
export class MakbuzComponent implements OnInit {
  displayedColumns: string[] = ['urunKodu', 'urunAdi', 'stokGerekliMi', 'urunFiyat', 'islem'];
  displayedColumns2: string[] = ['urunAdi', 'urunAdet', 'tutar', 'islem'];
  dataSource: any=[];
  dataSource1: any = [];
  makbuzToplam: number = 0;
  tcVergino!: number;
  evrakKayitNumarasi!: number;
  isletmeAdiAdSoyad: string = "";
  adres: string = "";
  odemeSekli:string="Nakit";

  urunCtrl = new FormControl('');
  adresCtrl = new FormControl('');
  adSoyadFirmaAdCtrl = new FormControl('');
  tcNoVergiNoCtrl = new FormControl('');
  evrakKayitNoCtrl = new FormControl('');
  odemeSekliCtrl = new FormControl('');

  filteredUruns: Observable<Iurun[]>;
  filteredfirmas1: Observable<ifirma[]>;
  filteredfirmas2: Observable<ifirma[]>;

  firmas1:ifirma[] =[];
  firmas2:ifirma[] =[];


  @ViewChild('matUrun') table!: MatTable<Iurun>;
  @ViewChild('matMakbuz') table2!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    public userService: UserService,
    public urunService: UrunService,
    public firmaService:FirmaService,
    public makbuzService:MakbuzService,
    public dialog: MatDialog,
    public router: Router


  ) {
    this.userService.getProfile();


    //Ürünleri autocomplete filtrelemesi
    this.filteredUruns = this.urunCtrl.valueChanges.pipe(
      startWith(''),
      //map(urun => (urun ? this._filterUruns(urun).slice(0,4) : this.dataSource.slice(0,4))),
      map(urun => (urun = this._filterUruns(urun).slice(0,4) )),

    );

    //Firmaların autocomplete filtrelemesi
    this.filteredfirmas1 = this.adSoyadFirmaAdCtrl.valueChanges.pipe(
      startWith(''),
      map(firma =>(firma = this._filterFirmasByAd2(firma).slice(0,4))),
    );
    
    //tcno filtresi
    this.filteredfirmas2 = this.tcNoVergiNoCtrl.valueChanges.pipe(
      startWith(''),
      map(firma =>(firma = this._filterFirmasByTCno(firma).slice(0,4))),
    );
    

  }

  private _filterFirmasByTCno(value:string):ifirma[]{
    return this.firmas1.filter((_firma:ifirma)=>String(_firma.tcNoVergiNo).includes(value));
  }  
  private _filterFirmasByAd2(value:string):ifirma[]{
    return this.firmas2.filter((_firma:ifirma)=>_firma.adSoyadFirmaAd.includes(value));
  }  


  private _filterUruns(value: string): Iurun[] {
    //const filterValue = value.toLowerCase();

   return this.dataSource.filter( (_urun:Iurun) => _urun.urunAdi.includes(value));


}

  ngOnInit(): void {
    //service de hazırlanan
    this.firmaService.getFirmalar().subscribe(res=>{
      this.firmas1=res
      this.firmas2=res
      this.firmaService.firmalar=res
    })

   this.urunService.getUrunler().subscribe(res=>{
    this.dataSource=res
    this.urunService.urunler=res
   })   

  }
  //Dialog açılması ve kapanırken listenin yenilenmesi---
openDialog(): void {
  this.evrakKayitNumarasi = this.evrakKayitNoCtrl.value
  this.isletmeAdiAdSoyad = this.adSoyadFirmaAdCtrl.value
  this.tcVergino = this.tcNoVergiNoCtrl.value
  this.adres = this.adresCtrl.value
  this.makbuzToplam=Number((Math.round(this.makbuzToplam* 100) / 100).toFixed(2))

  let makbuzHazirla:Imakbuz={
    makbuzNo:-1,
    urunler:this.dataSource1,
    makbuzMutemetBolgesi:this.userService.userData.kullaniciBolge,
    makbuzKaydeden:this.userService.userData.kullaniciAdi,
    makbuzTutari:this.makbuzToplam,
    tcnoVergiNo:this.tcVergino,
    isletmeAdiAdSoyad:this.isletmeAdiAdSoyad,
    isletmeAdres:this.adresCtrl.value,
    evrakKayitNumarasi:this.evrakKayitNumarasi,
    odemeSekli:this.odemeSekliCtrl.value
    }

  const dialogRef = this.dialog.open(makbuzOlusturmaDialog, {
    width: 'inherit',
    data:makbuzHazirla
  });

  dialogRef.afterClosed().subscribe((result: any) => {
  });
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  tcVerginoIleFirmaSec(firma_:ifirma){
    this.adSoyadFirmaAdCtrl.setValue(firma_.adSoyadFirmaAd);
    this.adresCtrl.setValue(firma_.adres);
    this.tcNoVergiNoCtrl.setValue(firma_.tcNoVergiNo);
  }
adSoyadFirmaAdIleFirmaSec(firma_:ifirma){
  this.adSoyadFirmaAdCtrl.setValue(firma_.adSoyadFirmaAd);
  this.adresCtrl.setValue(firma_.adres);
  this.tcNoVergiNoCtrl.setValue(firma_.tcNoVergiNo);
}

  vezneyeGonder() {
    if(this.dataSource1.length===0&&this.tcVergino===0&&this.isletmeAdiAdSoyad==="")
        return
        else if(this.tcVergino.toString().length<9&& this.tcVergino.toString().length>11){
          return
        }

    let makbuzHazirla:Imakbuz={
    makbuzNo:0,
    urunler:this.dataSource1,
    makbuzMutemetBolgesi:this.userService.userData.kullaniciBolge,
    makbuzKaydeden:this.userService.userData.kullaniciAdi,
    makbuzTutari:this.makbuzToplam,
    tcnoVergiNo:this.tcVergino,
    isletmeAdiAdSoyad:this.isletmeAdiAdSoyad,
    isletmeAdres:this.isletmeAdiAdSoyad,
    evrakKayitNumarasi:this.evrakKayitNumarasi,
    odemeSekli:"Nakit"
    }

    this.makbuzService.addMakbuz(makbuzHazirla)
    .subscribe(res => {
      console.log(res.makbuzKaydeden+" tarafından makbuz kaydedildi");       


    }, error => {
      console.log("Makbuz Kayıt Hatası", error);
      this.userService.logOut();

    }, () => {
      //Vezneye Gönderilen Makbuz Listeme Götür  
      //this.router.navigate(["/kasa"]);

    }
    );



  }
  makbuzaUrunEkle(_urun: Iurun) {
    var ekle = {
      urun: _urun,
      adet: 1
    }
    this.dataSource1.push(ekle);
    this.makbuzToplam += _urun.urunFiyat;
    console.log(this.makbuzToplam);

    this.table2.renderRows();

  }
  makbuzdanUrunSil(_urun: any) {
    var bulunanIndex = this.dataSource1.findIndex((s: Iurun) => s === _urun)

    //önce adet ile ürün fiyatı kadar silinir sonra yeni adet ile çarpılıp tutar makbuz toplamına eklenir
    this.makbuzToplam -= this.dataSource1[bulunanIndex].adet * this.dataSource1[bulunanIndex].urun.urunFiyat;

    this.dataSource1 = this.dataSource1.filter((s: Iurun) => s !== _urun);
    this.table2.renderRows();


  }
  adetDegistir(el: any, event: Event) {

    var bulunanIndex = this.dataSource1.findIndex((s: Iurun) => s === el)
    var adet: number = +(event.target as HTMLInputElement).value;

    if (adet <= 0) {
      (event.target as HTMLInputElement).value = "1";
      this.makbuzToplam -= this.dataSource1[bulunanIndex].adet * this.dataSource1[bulunanIndex].urun.urunFiyat;
      this.dataSource1[bulunanIndex].adet = 1;
      this.makbuzToplam = 0;

      this.dataSource1.forEach((element: { adet: number; urun: { urunFiyat: number; }; }) => {
        this.makbuzToplam += (element.adet * element.urun.urunFiyat);

      });

      this.table2.renderRows();
      return
    }


    //önce adet ile ürün fiyatı kadar silinir sonra yeni adet ile çarpılıp tutar makbuz toplamına eklenir
    this.makbuzToplam -= this.dataSource1[bulunanIndex].adet * this.dataSource1[bulunanIndex].urun.urunFiyat;
    this.dataSource1[bulunanIndex].adet = adet;

    this.makbuzToplam += adet * this.dataSource1[bulunanIndex].urun.urunFiyat;
    this.table2.renderRows();

  }

  tcVergiNoEkle(event: Event) {
    this.tcVergino = +(event.target as HTMLInputElement).value;
    console.log(this.tcVergino);

  }

  adSoyadIsletme(event: Event) {
    this.isletmeAdiAdSoyad = (event.target as HTMLInputElement).value
  }

  adresEkle(event:Event){
    this.adres = (event.target as HTMLInputElement).value

  }
  evrakKayitNumarasiEkle(event: Event) {
    this.evrakKayitNumarasi = +(event.target as HTMLInputElement).value
  }
  

}





@Component({
  selector: 'makbuzOlusturmaDialog',
  templateUrl: 'makbuzOlusturmaDialog.html',
  styleUrls: ['./makbuz.component.css']
})

export class makbuzOlusturmaDialog implements OnInit{
  displayedColumns3: string[] = ['urunAdi', 'urunAdet', 'tutar', 'islem'];
  form: FormGroup = this.formBuilder.group({

  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<makbuzOlusturmaDialog>,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public makbuzService: MakbuzService

  ) { }
ngOnInit(): void {
 console.log(this.data)
}
  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    
    this.makbuzService.addMakbuz(this.data)
    .subscribe(res=>{
      console.log("Makbuz Kaydedildi+"+res);
      this.dialogRef.close();
    })
  
  }




}
