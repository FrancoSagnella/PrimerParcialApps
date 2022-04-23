import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router:Router, private auth:AuthService) {}

  volver(){
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  chat4a()
  {
    this.router.navigateByUrl('/chat4a');
  }

  chat4b()
  {
    this.router.navigateByUrl('/chat4b');

  }
}
