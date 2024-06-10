import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Bursa Döner Sermaye Sistemi';



  constructor(
    public userService: UserService,
    private router:Router
  ) {

  }
  ngOnInit(): void {
    if(this.userService.isLogged===true)
      {
        this.userService.userData=this.userService.getProfile();
      }
      else
      this.router.navigate(["/login"]);
    
  }



  
}
