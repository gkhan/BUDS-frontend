import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BolgebirimService } from 'src/app/services/bolgebirim.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-kullanici',
  templateUrl: './kullanici.component.html',
  styleUrls: ['./kullanici.component.css']
})
export class KullaniciComponent implements OnInit{
  displayedColumns: string[] = ['kullaniciAdi','email', 'kullaniciBolge', 'kullaniciRol', 'islem'];
  dataSource: any;
  @ViewChild(MatTable) table!: MatTable<any>;


  constructor(
    public userService:UserService,    
    public dialog: MatDialog
  ){

}
ngOnInit(): void {

  this.userService.getUsers(this.userService.userData.token)
  .subscribe({
    next:(value) =>{
      this.dataSource=value
    },
    error:(err) =>{
      console.log(err)
      this.userService.logOut();
    },
    complete:()=> {
      //console.log("Kullanicilar getirildi.");
    },
  })
  
  
}

kullaniciSil(kullanici:any){
  this.userService.deleteUser(kullanici._id)
  .subscribe(res=>{
    this.dataSource= this.userService.getUsers(this.userService.userData.token)
    console.log(res);
  })

}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

openDialog(): void {
  const dialogreRef = this.dialog.open(kullaniciEkleDialog, {
    width: 'inherit'
  })

  //kullanıcı ekleme diyaloğu kapandıktan sonra datasource güncellensin diye
  dialogreRef.afterClosed()
  .subscribe(result=>{
    this.dataSource= this.userService.getUsers(this.userService.userData.token)    

    })
  

}



}


//kullanıcı ekleme dialog
@Component({
  selector: 'kullaniciEkleDialog',
  templateUrl: 'kullaniciEkleDialog.html',
})
export class kullaniciEkleDialog implements OnInit{
  form: FormGroup = this.formBuilder.group({
    kullaniciAdi: ['', Validators.required],
    kullaniciBolge: ['', Validators.required],
    kullaniciRol: ['', Validators.required],
    email: ['', Validators.required]

  });
  kullaniciRol="Belge Oluşturan";
  kullaniciRolleri=["Belge Oluşturan","Yönetici","Mutemet","Veznedar"];
  bolgeListesi:any
  sayacAdi:string=""

  constructor(
    public dialogRef: MatDialogRef<kullaniciEkleDialog>,
    private formBuilder: FormBuilder,
    public userService: UserService,
    public bolgebirimService:BolgebirimService

  ) { }
  ngOnInit(): void {
    this.bolgebirimService.getKasaBolges()
    .subscribe({
      next:(v)=>{
        this.bolgeListesi=v;

      },
      error:(e)=>{

      },
      complete:()=>{
        
        
      },
      
    })   
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    if (this.userService.isLogged) {
      var kullanici = {
        kullaniciAdi: this.form.controls["kullaniciAdi"].value,
        kullaniciBolge: this.form.controls["kullaniciBolge"].value,
        kullaniciRol: this.form.controls["kullaniciRol"].value,
        password:"123456",
        email:this.form.controls["email"].value
      }
      console.log(kullanici);

      //this.kullaniciService.kullaniciEkle() -----  gelicek 
      this.userService.addUser(kullanici)
      .subscribe({
        next:(v)=>{
          //console.log(v);

        },
        error:(e)=>{

        },
        complete:()=>{
          this.dialogRef.close();
          
          
        },
        
      })   
   
    }

  }


  kullaniciRolSec(){
    console.log("Test");
  }
  

}