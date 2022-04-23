import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { MenuController, NavController} from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(private authService:AuthService,
    private router:Router,
    public loading:LoadingService,
    private menu:MenuController,
    private navController:NavController) { }

  ngOnInit() {}

  async onLogOut() {
    this.loading.present();
    await this.authService.logout();
    this.loading.dismiss();
    this.menu.close();
    // this.navController.navigateBack('/login');
    // this.navController.navigateRoot('/login');
    this.router.navigateByUrl('/login');
  } 

  redirectGalery()
  {
    // this.navController.navigateBack('/principal/galeria');
    this.router.navigateByUrl('/principal/galeria')
  }

  redirectHome() 
  {
    // this.navController.navigateBack('/principal/home');
    this.router.navigateByUrl('/principal/home')
  }

  redirectEstadisticas() 
  {
    // this.navController.navigateBack('/principal/home');
    this.router.navigateByUrl('/principal/estadisticas')
  }
}
