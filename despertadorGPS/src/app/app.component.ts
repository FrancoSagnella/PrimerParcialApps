import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  splash=true;
  constructor(private platform:Platform, private router:Router, private auth:AuthService) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(()=>{
      setTimeout(()=>{
        SplashScreen.hide();
        if(this.splash){
          setTimeout(()=>{
            this.splash=false;
          }, 4600);
        }
      },3000);
    });
  }
}
