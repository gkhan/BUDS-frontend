import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, DoCheck, ElementRef, Inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { KasaService } from 'src/app/services/kasa.service';
import { MakbuzService } from 'src/app/services/makbuz.service';
import { UserService } from 'src/app/services/user.service';
import { Imakbuz } from 'src/app/interfaces/imakbuz';
import { SayacService } from 'src/app/services/sayac.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { jsPDF } from "jspdf";
import 'src/assets/Newtime-normal.js'


@Component({
  selector: 'app-kasa',
  templateUrl: './kasa.component.html',
  styleUrls: ['./kasa.component.css']
})
export class KasaComponent implements OnInit {

  displayedColumns2: string[] = ['evrakKayitNumarasi','tcnoVergiNo', 'isletmeAdiAdSoyad', 'makbuzTutari', 'urunler','makbuzTarihi','makbuzKaydeden', 'islem'];
  dataSource1: any;
  kasaToplam: number = 0;
  makbuzlar: Array<Imakbuz> = [];
  makbuzSayac:any;
  loading:boolean=true;

  document = new jsPDF()

  @ViewChild('matMakbuz') table2!: MatTable<any>;

  constructor(
    public userService: UserService,
    public makbuzService: MakbuzService,
    public kasaService: KasaService,
    public sayacService:SayacService,
    public dialog:MatDialog

  ) {
    

  }

  ngOnInit(): void {

  


    if(this.userService.getProfile()){
      this.odenmeyiBekleyenMakbuzlar();
      this.kasayiGuncelle();
      this.sayacGuncellestir();
    }

  }
  //Sayaç Değerlerini Güncelleştir
  sayacGuncellestir():void{
    this.sayacService.sayacAktifBolgeGetir(this.userService.userData.kullaniciBolge)
    .subscribe({
      next:(v)=> {
        this.makbuzSayac=v
      },
      error:(e)=>{
        console.error(e);
        this.userService.logOut();

      },
      complete:()=>{
        this.loading=false
      }
    })
  }
  //Dialog
  openDialog(_makbuz:Imakbuz): void {
   if(_makbuz.makbuzTutari!==undefined){
      _makbuz.makbuzTutari=Number((Math.round(_makbuz.makbuzTutari* 100) / 100).toFixed(2))
   }
  
    
  
    const dialogRef = this.dialog.open(kasaMakbuzKaydetDialog, {
      width: 'inherit',
      data:_makbuz,
    });
    dialogRef.componentInstance.sayac=this.makbuzSayac
    dialogRef.afterClosed().subscribe((result: any) => {
      this.sayacGuncellestir()
      this.odenmeyiBekleyenMakbuzlar();
      this.kasayiGuncelle();
    });
  }

  odenmeyiBekleyenMakbuzlar() {
    this.makbuzService.getMakbuzsOdenmemis()
      .subscribe({
        next: (v) => {
          this.dataSource1 = v;

        },
        error: (e) => {
          console.error(e);
          this.userService.logOut();

        },
        complete: () => {
          console.info('complete')
        }

      })
  }

  kasayiGuncelle() {
    this.kasaService.aktifKasayiGetir()
      .subscribe({
        next: (v) => {
          this.kasaService.kasaData = v;

          if (this.kasaService.kasaData.makbuzlar !== undefined) {
            this.makbuzlar = this.kasaService.kasaData.makbuzlar;
            this.kasaToplam = this.kasaService.kasaData.kasaTutari;
          }

        },
        error: (e) => {
          this.userService.logOut();
          console.error(e)
        },
        complete: () => {
          console.info('Kasa Güncellendi.');
        }

      })

    //console.log(this.kasaService.kasaData);

  }

  makbuzKaydet(_makbuz: Imakbuz) {


  }


}


@Component({
  selector: 'kasaMakbuzKaydetDialog',
  templateUrl: 'kasaMakbuzKaydetDialog.html',
  styleUrls: ['./kasa.component.css']
})

export class kasaMakbuzKaydetDialog implements OnInit{
  displayedColumns3: string[] = ['urunAdi', 'urunAdet', 'tutar', 'islem'];
  loading:boolean=true;
  numbers:number[]= []
  yaziyla="";
  ondalik=""

  @ViewChild('mkbzHTML') c!:ElementRef
  form: FormGroup = this.formBuilder.group({

  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public sayac: any,

    public dialogRef: MatDialogRef<kasaMakbuzKaydetDialog>,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public makbuzService: MakbuzService,
    public sayacService:SayacService,
    public kasaService:KasaService

  ) { }
ngOnInit(): void {
  this.data.makbuzOdemeAlan=this.userService.userData.kullaniciAdi;
  this.data.makbuzDegistiren =this.userService.userData.kullaniciAdi;
  this.loading=false
  this.numbers=Array(4-this.data.urunler.length).fill(0).map((x,i)=>i);
  this.yaziyla=this.SayiDonustur(this.data.makbuzTutari);

  //Parse İşlemleri Kuruş Ekleyebilmek için
  var a = parseFloat(this.data.makbuzTutari).toFixed(2);
  var b=  a.substring(a.indexOf("."),a.length); 
  if(b.substring(1)!=='00'){

    this.ondalik = this.SayiDonustur(Number(b.substring(1)))
    this.ondalik+="kuruş"
  }



  console.log(Math.round(this.data.makbuzTutari*100)/100)
  console.log(this.yaziyla)
  console.log(this.numbers)
}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    
    if (this.data.makbuzOdemeAlan === "Odenmedi") {
      this.data.makbuzOdemeAlan = this.userService.userData.kullaniciAdi;
      if (this.data._id !== undefined) {
        //Kaydedilen makbuzİçerikleri
        this.data.makbuzAsamasi ="Odendi"
        this.data.makbuzDegistiren= this.userService.userData.kullaniciAdi
        this.data.makbuzDegistirmeTarihi = Date.now
        this.data.makbuzSeriNo= this.sayac.sayacAraligiSeriNo
        this.data.makbuzNo=this.sayac.sayacDegeri

        this.makbuzService.editMakbuz(this.data._id, this.data)
          .subscribe({
            next: (v) => {
              //Kasaya
              this.kasaService.kasaData.makbuzlar.push(this.data)
              this.kasaService.kasaData.kasaTutari += this.data.makbuzTutari
              this.kasaService.kasayiGuncelle(this.kasaService.kasaData._id,this.kasaService.kasaData)
              .subscribe({
                next:(v)=>{

                },
                error:(e)=>{

                },
                complete:()=>{
                  console.log("Kasa Güncellendi")
                }
              })



              //Sayaç Arttırma İşlevi
              this.sayacService.sayacDegeriArttir(this.sayac)
              .subscribe({
                next:(res)=>{
                  console.log(res)
                },
                error:(e)=>{
                  console.log(e)
                },
                complete:()=>{
                  console.info('Sayac Arttırıldı')
                }
              })
            },
            error: (e) => {
              this.userService.logOut();
              console.error(e)
            },
            complete: () => {
              console.info('Makbuz Güncellendi.');
            }

          })

      }

    }
  
  }


  public makbuzPDF(){
    this.loading=true

    let doc =new jsPDF('l','pt',[610,425]);
    doc.setFont("Newtime")
    let data =this.c.nativeElement
    data.style.display="block"
 
    doc.html(data, {
      callback: function (doc) {
        // doc.setFont('Newtime','normal')
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
        // doc.save();
        data.style.display="none"
        
      }
   }).then(()=>{
    this.loading=false
   });

  }

//Sayıyı Yazıya Dönüştürme İşlemi
public SayiDonustur(sayi:number):string{
 
  var sayiS =String(sayi);
  var sonuc=""
   
  let bolum1 = ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
  let bolum2 = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
  let bolum3 = ["", "yüz", "bin", "milyon", "milyar", "trilyon", "katrilyon"];
   
  var sayi1; //tam kısım
  var sayi2 = ""; // ondalıklı kısım
   
   
  sayiS = sayiS.replace(",", "."); //virgül girilirse noktaya dönüştürülüyor
   
  if (sayiS.indexOf(".") > 0) 
  { // nokta varsa (kuruş)
   
  sayi1 = sayiS.substring(0, sayiS.indexOf(".")); // tam kısım
  sayi2 = sayiS.substring(sayiS.indexOf("."), sayiS.length); // ondalıklı kısım
   
  }
  else 
  {
  sayi1 = sayiS; // ondalık yok
  }
   
  var rk = sayi1.split(""); // rakamlara ayırma
   
  let son;
  let w = 1; // işlenen basamak
  var sonaekle = 0; // binler on binler yüzbinler vs. için sona bin (milyon,trilyon...) eklenecek mi?
  let kac = rk.length; // kaç rakam var?
  let sonint; // işlenen basamağın rakamsal değeri
  let uclubasamak = 0; // hangi basamakta (birler onlar yüzler gibi)
  let artan = 0;  // binler milyonlar milyarlar gibi artışları yapar
  let gecici;
   
  if (kac > 0) { // virgül öncesinde rakam var mı?
   
  for (let i = 0; i < kac; i++) 
  {
  son = rk[kac - 1 - i]; // son karakterden başlayarak çözümleme yapılır.
  sonint = parseInt(son); // işlenen rakam
  if (w == 1) 
  { // birinci basamak bulunuyor
  sonuc = bolum1[sonint] + sonuc;
  } 
  else if (w == 2) 
  { // ikinci basamak
  sonuc = bolum2[sonint] + sonuc;
  } 
  else if (w == 3) 
  { // 3. basamak
  if (sonint == 1) 
  {
  sonuc = bolum3[1] + sonuc;
  } 
  else if (sonint > 1) 
  {
  sonuc = bolum1[sonint] + bolum3[1] + sonuc;
  }
  uclubasamak++;
  }
  if (w > 3) 
  {    // 3. basamaktan sonraki işlemler
  if (uclubasamak == 1) 
  {
  if (sonint > 0) 
  {
  sonuc = bolum1[sonint] + bolum3[2 + artan] + sonuc;
  if (artan == 0) 
  { // birbin yazmasını engelle
  if(kac-1==i)
  { //
  sonuc = sonuc.replace(bolum1[1] + bolum3[2], bolum3[2]);
  }
  }
  sonaekle = 1; // sona bin eklendi
  } 
  else 
  {
  sonaekle = 0;
  }
  uclubasamak++;
   
  } 
  else if (uclubasamak == 2) 
  {
  if (sonint > 0) 
  {
  if (sonaekle > 0) 
  {
  sonuc = bolum2[sonint] + sonuc;
  sonaekle++;
  } 
  else
  {
  sonuc = bolum2[sonint] + bolum3[2 + artan] + sonuc;
  sonaekle++;
  }
  }
  uclubasamak++;
   
  } else if (uclubasamak == 3) 
  {
  if (sonint > 0) 
  {
  if (sonint == 1) 
  {
  gecici = bolum3[1];
  }
  else 
  {
  gecici = bolum1[sonint] + bolum3[1];
  }
  if (sonaekle == 0) 
  {
  gecici = gecici + bolum3[2 + artan];
  }
  sonuc = gecici + sonuc;
  }
  uclubasamak = 1;
  artan++;
  }
   
  }
  w++; // işlenen basamak
  }
   
  }
  


  return sonuc

}


}