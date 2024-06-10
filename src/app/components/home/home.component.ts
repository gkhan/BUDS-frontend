import { Component, OnInit, ViewChild, Inject, Input } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Iurun } from 'src/app/interfaces/iurun';
import { UrunService } from 'src/app/services/urun.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['urunKodu', 'urunAdi', 'stokGerekliMi', 'urunFiyat', 'olusturulmaTarihi','kdvOrani', 'islem'];
  dataSource: any;
  fileName:string="";
  uploadProgress:number| undefined;
  uploadSub:Subscription | undefined;
 

  @Input()
  requiredFileType:string="";

  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    public userService: UserService,
    public urunService: UrunService,
    public dialog: MatDialog

  ) {

  }


  ngOnInit(): void {
    this.userService.getProfile();

    this.urunService.getUrunler()
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  urunDuzenle(urun:Iurun){
    this.editDialog(urun);
  }

  urunSil(urun: Iurun) {
    console.log("urun siliniyor");
    if (urun._id !== undefined)
      this.urunService.deleteUrun(urun._id)
        .subscribe({
          next: (v) => {
            console.info(v.urunAdi + " adlı ürün/hizmet silindi")

          },
          error: (e) => {
            console.log("geçersiz token hatası", e);
            this.userService.logOut();

          },
          complete: () => {
            console.info('complete')
            this.urunService.getUrunler()
              .subscribe({
                next: (v) => {
                  this.dataSource = new MatTableDataSource(v);
                },
                error: (e) => {
                  console.log("geçersiz token hatası", e);
                  this.userService.logOut();

                },
                complete: () => {
                  this.table.renderRows();
                }
                //     .subscribe(res => {
                //       this.dataSource = new MatTableDataSource(res);
                //       this.table.renderRows();
                //     });
              }
              )
          }



          // (res => {
          //   this.urunService.getUrunler()
          //     .subscribe(res => {
          //       this.dataSource = new MatTableDataSource(res);
          //       this.table.renderRows();
          //     });
          // });

        })
  }

  onFileSelected(event:Event) {

    if(event.target==null)
        return

    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files[0]) {

        this.fileName = files[0].name;

        const formData = new FormData();

        formData.append("thumbnail", files[0]);

      console.log(this.fileName);
      //-- dosyayı api'ye gönderim aşağıda
       // const upload$ = this.http.post("/api/thumbnail-upload", formData);

        //upload$.subscribe();
    }
}
  cancelUpload(){
    //this.uploadSub.unsubscribe();
    this.reset();
  }

  reset(){
    this.uploadProgress = undefined;
    this.uploadSub = undefined;

  }

//Dialog açılması ve kapanırken listenin yenilenmesi---
  openDialog(): void {

    const dialogRef = this.dialog.open(urunEkleDialog, {
      width: 'inherit'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.urunService.getUrunler()
        .subscribe(res => {
          this.dataSource = new MatTableDataSource(res);
          this.table.renderRows();
        });
    });
  }

  //Edit edebilme fonksiyonu için forma ürün idsi getirilmesi gerekiyor.
  editDialog(urun:Iurun){

    //Edit formuna ürünün getirilmesi.
    const dialogRef = this.dialog.open(urunDegistirDialog,{ width:'inherit'});
    dialogRef.componentInstance.urunGetir(urun);//urunID yi degistirilenUrunId ye ata ve getirilen ürünü dialoga yazdır.
    

    //açıldıktan sonra ne olacağını buraya yazacağım ---
    dialogRef.afterClosed().subscribe({
      next:(v)=>{
        this.urunService.getUrunler()
          .subscribe(res=>{
            this.dataSource = new MatTableDataSource(res);
        this.table.renderRows();
          })
               
      },
      error:(e)=>{
        console.log(e);

      },
      complete:()=>{
      }
    })

  }

  
}

@Component({
  selector: 'urunEkleDialog',
  templateUrl: 'urunEkleDialog.html',
})
export class urunEkleDialog {
  form: FormGroup = this.formBuilder.group({
    urunKodu: ['', Validators.required],
    urunAdi: ['', Validators.required],
    urunFiyat: ['', Validators.required],
    stokGerekliMi: ['', Validators.required],
    kdvOrani:['',Validators.required]

  });

  constructor(
    public dialogRef: MatDialogRef<urunEkleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Iurun,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public urunService: UrunService,

  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    if (this.userService.isLogged) {
      var urun = {
        urunKodu: this.form.controls["urunKodu"].value,
        urunAdi: this.form.controls["urunAdi"].value,
        stokGerekliMi: this.form.controls["stokGerekliMi"].value,
        urunFiyat: this.form.controls["urunFiyat"].value,
        kimTarafindanOlusturuldu: this.userService.userData.kullaniciAdi,
        kdvOrani: this.form.controls["kdvOrani"].value
      }
      console.log(urun);

      this.urunService.addUrun(urun)
        .subscribe(result => {
          console.log(result.urunAdi, " eklendi");
          this.dialogRef.close();
        })
    }

  }

  urunGetir(urun:Iurun){
    //console.log(urun);
    this.form.controls["urunKodu"].setValue(urun.urunKodu);
    this.form.controls["urunAdi"].setValue(urun.urunAdi);
    this.form.controls["stokGerekliMi"].setValue(urun.stokGerekliMi);
    this.form.controls["urunFiyat"].setValue(urun.urunFiyat);
    this.form.controls["kdvOrani"].setValue(urun.kdvOrani);
  }

  

}
// urunDegistirDialog-----------------------------------------------------------------------
@Component({
  selector: 'urunDegistirDialog',
  templateUrl: 'urunDegistirDialog.html',
})
export class urunDegistirDialog {
  form: FormGroup = this.formBuilder.group({
    urunKodu: ['', Validators.required],
    urunAdi: ['', Validators.required],
    urunFiyat: ['', Validators.required],
    stokGerekliMi: ['', Validators.required],
    kdvOrani:['',Validators.required]

  });
  public degistirilenUrunId:string=""

  constructor(
    public dialogRef: MatDialogRef<urunEkleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Iurun,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public urunService: UrunService,

  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    if (this.userService.isLogged) {
      var urun = {
        urunKodu: this.form.controls["urunKodu"].value,
        urunAdi: this.form.controls["urunAdi"].value,
        stokGerekliMi: this.form.controls["stokGerekliMi"].value,
        urunFiyat: this.form.controls["urunFiyat"].value,
        kimTarafindanOlusturuldu: this.userService.userData.kullaniciAdi,
        kdvOrani:this.form.controls["kdvOrani"].value
      }
      console.log(urun);

      this.urunService.editUrun(this.degistirilenUrunId,urun)
        .subscribe(result => {
          console.log(urun.urunAdi, " değiştirildi.");
          this.dialogRef.close();
        })
    }

  }

  urunGetir(urun:Iurun){
    //console.log(urun);
    if(urun._id!==undefined)
      this.degistirilenUrunId=urun._id

    this.form.controls["urunKodu"].setValue(urun.urunKodu);
    this.form.controls["urunAdi"].setValue(urun.urunAdi);
    this.form.controls["stokGerekliMi"].setValue(urun.stokGerekliMi);
    this.form.controls["urunFiyat"].setValue(urun.urunFiyat);
    this.form.controls["kdvOrani"].setValue(urun.kdvOrani);
  }

  

}