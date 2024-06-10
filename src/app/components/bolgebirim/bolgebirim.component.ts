import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ikasabolge } from 'src/app/interfaces/ikasabolge';
import { BolgebirimService } from 'src/app/services/bolgebirim.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-bolgebirim',
  templateUrl: './bolgebirim.component.html',
  styleUrls: ['./bolgebirim.component.css']
})
export class BolgebirimComponent implements OnInit {
  displayedColumns: string[] = ['kasaBolgeAdi', 'islem'];
  dataSource: any;
  
  
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    public bolgebirimService:BolgebirimService,
    public userService:UserService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.bolgebirimService.getKasaBolges()
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

  //Dialog açılması ve kapanırken listenin yenilenmesi---
  openDialog(): void {

    const dialogRef = this.dialog.open(bolgebirimEkleDialog, {
      width: 'inherit'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.bolgebirimService.getKasaBolges()
        .subscribe(res => {
          this.dataSource = new MatTableDataSource(res);
          this.table.renderRows();
        });
    });
  }

  editDialog(kasabolge:ikasabolge):void{
    //Edit formuna bölgenin getirilmesi.
    const dialogRef = this.dialog.open(bolgebirimDegistirDialog,{ width:'inherit'});
    dialogRef.componentInstance.kasaBolgeGetir(kasabolge);
    

    //açıldıktan sonra ne olacağını buraya yazacağım ---
    dialogRef.afterClosed().subscribe({
      next:(v)=>{
        this.bolgebirimService.getKasaBolges()
          .subscribe({
            next:(res_: unknown[] | undefined)=>{
              this.dataSource = new MatTableDataSource(res_);
              this.table.renderRows();
            },
            error:(_e: any)=>{
              console.log(_e)
            },
            complete:()=>{

            }            
          })               
      },
      error:(e)=>{
        console.log(e);

      },
      complete:()=>{
      }
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  bolgeSil(el:ikasabolge){

  }


}

@Component({
  selector: 'bolgebirimEkleDialog',
  templateUrl: 'bolgebirimEkleDialog.html',
})

export class bolgebirimEkleDialog {
  form: FormGroup = this.formBuilder.group({
    kasaBolgeAdi: ['', Validators.required]

  });

  constructor(
    public dialogRef: MatDialogRef<bolgebirimEkleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ikasabolge,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public bolgebirimService: BolgebirimService,

  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    if(this.userService.isLogged){
      var kasabolge_ = {
        kasaBolgeAdi:this.form.controls["kasaBolgeAdi"].value,
        kasaBolgeOlusturan:this.userService.userData.kullaniciAdi
      }

      this.bolgebirimService.addKasaBolge(kasabolge_)
      .subscribe({
        next:(v)=>{
          console.log("Başarılı")

        },
        error:(e)=>{
          console.log("Bölge Eklenirken Hata Oluştu : "+e)
        },
        complete:()=>{
          this.dialogRef.close()
        }
      })
    }


  
  }


}


@Component({
  selector: 'bolgebirimDegistirDialog',
  templateUrl: 'bolgebirimDegistirDialog.html',
})

export class bolgebirimDegistirDialog {
  form: FormGroup = this.formBuilder.group({
    kasaBolgeAdi: ['', Validators.required]

  });

  public degistirilenKasaBolgeId:string=""

  constructor(
    public dialogRef: MatDialogRef<bolgebirimDegistirDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ikasabolge,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public bolgebirimService: BolgebirimService,

  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    if (this.form.invalid) {
      return;      
    }

    if(this.userService.isLogged){
      var kasabolge_ ={
          kasaBolgeAdi:this.form.controls["kasaBolgeAdi"].value,
          kasaBolgeDegistiren:this.userService.userData.kullaniciAdi
      }

      this.bolgebirimService.editKasaBolge(this.degistirilenKasaBolgeId,kasabolge_)
      .subscribe({
        next:(v)=>{
            console.log("Bolge/Birim değiştirildi.")
        },
        error:(e)=>{
          console.log("Hata Meydana Geldi Editlenirken "+e)

        },
        complete:()=>{
          this.dialogRef.close();
        }
      })
      
    }
  
  }

  kasaBolgeGetir(kasabolge:ikasabolge){
    if(kasabolge._id !==undefined){
      this.degistirilenKasaBolgeId=kasabolge._id
    }

    this.form.controls["kasaBolgeAdi"].setValue(kasabolge.kasaBolgeAdi)

  }


}

