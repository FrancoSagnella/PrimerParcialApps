import { Component } from '@angular/core';
// import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  splash=true;
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
