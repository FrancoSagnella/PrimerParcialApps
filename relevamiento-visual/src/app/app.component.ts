import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  splash:boolean=true;
  constructor(private platform:Platform) {
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
