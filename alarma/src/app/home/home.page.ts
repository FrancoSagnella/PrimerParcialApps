import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';

import {Vibration} from '@ionic-native/vibration/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  fotoBoton='./assets/botonApagado.png';
  fotoAlarma='./assets/alarmaApagado.png';
  encendida=false;
  pedirPassword=false;
  currentUser;
  password = '';
  passwordEscrita = '';
  audio = new Audio();

  subscription:any;

  sonando = false;
  constructor(private authService:AuthService,
    private router:Router,
    public loading:LoadingService,
    private toast:ToastController,
    private deviceMotion:DeviceMotion,
    private flashlight:Flashlight,
    private screenOrientation:ScreenOrientation,
    private vibration:Vibration) {}

  async ionViewDidEnter() {
    this.authService.afAuth.user.subscribe(user => {
      this.currentUser = user;
      console.info('usuario', this.currentUser);
      switch(user.email)
      {
        case 'admin@admin.com':
          this.password = '111111';
          break;
          case 'invitado@invitado.com':
          this.password = '222222';
          break;
          case 'usuario@usuario.com':
          this.password = '333333';
          break;
          case 'anonimo@anonimo.com':
          this.password = '444444';
          break;
          case 'tester@tester.com':
          this.password = '555555';
          break;
      }
    });
  }

  ionViewDidLeave() {
    this.fotoBoton='./assets/botonApagado.png';
    this.fotoAlarma='./assets/alarmaApagado.png';
    this.encendida=false;
    this.pedirPassword=false;
    this.passwordEscrita = '';
    this.password = '';
  }

  encender() {
    if(!this.encendida){
      this.encendida=true;
      this.fotoBoton='./assets/botonEncendido.png';
      this.fotoAlarma='./assets/alarmaPrendido.png';

      this.onActive();

    }
    else{
      this.pedirPassword = true;
      this.onDesactive();
    }
  }

  apagar() {
    this.encendida=false;
    this.fotoBoton='./assets/botonApagado.png';
    this.fotoAlarma='./assets/alarmaApagado.png';
  }

  confirmar() {
    if(this.password == this.passwordEscrita)
    {
      this.presentToast('Alarma apagada', 2000, 'success', 'Contraseña confrimada');
      this.apagar();
      this.pedirPassword = false;
    } else{
      this.presentToast('No se apagó la alarma', 2000, 'danger', 'Contraseña incorrecta');
      this.encendida = true;
      this.pedirPassword = false;
      this.onActive();
    }
  }

  cancelar(){
    this.encendida = true;
    this.pedirPassword = false;
    this.onActive();
  }

  onActive() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);

    this.activeAceleration();
  }

  onDesactive() {
    this.subscription.unsubscribe();
  }

  activeAceleration() {
    this.subscription = this.deviceMotion.watchAcceleration({ frequency: 300 }).subscribe((acceleration: DeviceMotionAccelerationData) => {

      if(!this.sonando)
      {
        if (acceleration.x > 5) {
          this.playAudio("/assets/altoAhi.wav");
          this.sonando = true;
          setTimeout(() => {this.sonando = false}, 5000);
        }
        else if (acceleration.x < -5) {
          this.playAudio("/assets/noMeAfanes.wav");
          this.sonando = true;
          setTimeout(() => {this.sonando = false}, 5000);
        }
        else if (acceleration.y >= 9) {
          this.activeFlash(5);
          this.sonando = true;
        }
        else if (acceleration.z >= 9  && (acceleration.y >= -1 && acceleration.y <= 1) && (acceleration.x >= -1 && acceleration.x <= 1)) {
          this.activeVib(5);
          this.sonando = true;
          setTimeout(() => {this.sonando = false}, 5000);
        }
      }
    });
  }

  activeFlash(seconds: number) {
    this.flashlight.switchOn();
    this.playAudio("/assets/alarma.wav");
    setTimeout(() => { this.flashlight.switchOff();this.sonando=false }, seconds * 1000);
  }

  activeVib(seconds: number) {
    this.playAudio("/assets/alarma.wav");
    this.vibration.vibrate(seconds * 1000);
  }

  playAudio(path: string) {
    const audio = new Audio(path);
    audio.play();
    setTimeout(() => { audio.pause() }, 5000)
  }

  async onLogout() {
    this.loading.present();
    await this.authService.logout();
    this.router.navigateByUrl('login');
    this.loading.dismiss();
  } 

  async presentToast(mensaje: string, duracion: number, color: string, titulo: string, boton?: boolean,
    tituloBotonUno?: string, tituloBotonDos?: string, urlUno?: string, urlDos?: string) {
    let toast;
    if (boton) {
      toast = await this.toast.create({
        message: mensaje,
        duration: duracion,
        color: color,
        header: titulo,
        buttons: [
          {
            side: "end",
            text: tituloBotonUno,
            handler: () => {
              this.router.navigateByUrl("/" + urlUno);
            }
          },
          {
            side: "end",
            text: tituloBotonDos,
            handler: () => {
              this.router.navigateByUrl("/" + urlDos);
            }
          }
        ]

      });
    }
    else {
      toast = await this.toast.create({
        message: mensaje,
        duration: duracion,
        color: color,
        header: titulo
      });
    }
    toast.present();
  }
}
