import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {


  form: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  loading = false;
  submitted = false;
  msg = "Lütfen Giriş Yapınız";

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    // if (this.userService.getProfile()) {
    //   if(this.userService.userData.kullaniciRol==="admin"){
    //       this.router.navigate(["home"]);
    //     }
    //     else{
    //       this.router.navigate(["makbuz"]);
    //     }
    // }

  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.userService.LogIn(this.f['username'].value, this.f['password'].value)
    .subscribe({
      next: (response) => {
        if (response.status === 500) {
          this.msg = "Kullanıcı adı veya şifre hatalı";
          this.userService.logOut();
          return response;
        }
        else if (response.status === 200) {
          localStorage.removeItem(this.userService._baseUrl);
          this.userService.userData = response.body;
          this.userService.isLogged = true;
          localStorage.setItem(this.userService._baseUrl, JSON.stringify(response.body));
          //console.log("giriş başarılı");
          if(this.userService.userData.kullaniciRol==="admin"){
             this.router.navigate(["/makbuz"]);
            }
            else{
              this.router.navigate(["/makbuz"]);
            }

          return response
        }
        else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem(this.userService._baseUrl);
          return response
        }
        else{
          localStorage.removeItem(this.userService._baseUrl);
          return response;
        }
      },
      error: (e) => {
        console.error(e);
        localStorage.removeItem(this.userService._baseUrl);

      },
      complete: () => {
        //console.info('kullanici girisi yapildi')
      }

    });
    
    if(!this.userService.isLogged){
        this.msg = "Hatalı Kullanıcı Adı veya Şifre";
        this.loading=false;
        return
    }  

  }

}
