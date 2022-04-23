import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from '../clases/user';
import { Input } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { LoadingService } from '../services/loading.service';
import {MenuController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  @Input() listaUsuarios = [{ "id": 1, "email": "admin@admin.com", "password": "111111", "perfil": "admin", "sexo": "femenino", "name": "admin" },
  { "id": 2, "email": "invitado@invitado.com", "password": "222222", "perfil": "invitado", "sexo": "femenino", "name": "invitado" },
  { "id": 3, "email": "usuario@usuario.com", "password": "333333", "perfil": "usuario", "sexo": "masculino", "name": "usuario" },
  { "id": 4, "email": "anonimo@anonimo.com", "password": "444444", "perfil": "usuario", "sexo": "masculino", "name": "anonimo" },
  { "id": 5, "email": "tester@tester.com", "password": "555555", "perfil": "tester", "sexo": "femenino", "name": "tester" }]
  @Input() user: User = new User();
  
  // public users:any = [];
  constructor(
    private authService: AuthService,
    private toast: ToastController,
    private router: Router,
    private firestore:FirestoreService,
    public loading:LoadingService,
    private menuCtrl:MenuController,
    private navController:NavController) { }

  ionViewDidEnter():void {
    this.menuCtrl.enable(false);
  }

  ionViewDidLeave():void {
    this.menuCtrl.enable(true);
    this.user = new User();
  }

  seleccionarUsuario(usuario) {
    this.user.email = usuario.email;
    this.user.password = usuario.password;
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


  async onRegister() {
    const response = await this.authService.register(this.user.email, this.user.password);
    if (typeof(response) !== 'string') {
      this.authService.currentUser = this.user;
      // this.presentToast("Cuenta creada!", 3000, "success", "");

      this.router.navigateByUrl('/principal/home');
      // this.navController.navigateRoot('/principal/home');
    }
    else {
      this.presentToast(response, 3000, "warning", "");
    }
  }


  async onLogin() {
    this.loading.present();
    const response = await this.authService.login(this.user.email, this.user.password);
    if (typeof(response) !== 'string') {
      this.authService.currentUser = this.user;
      // this.presentToast("Iniciaste sesion!", 3000, "success", "");
      let toast = this.toast.create({
        message: 'Iniciaste sesion!',
        duration: 1200,
        position: 'bottom',
      });
      (await toast).present();
      this.loading.dismiss();
      this.router.navigateByUrl('/principal/home');
      // this.navController.navigateRoot('/principal/home');
    }
    else {
      // this.presentToast(response, 3000, "warning", '');
      let toast = this.toast.create({
        message: 'response',
        duration: 1200,
        position: 'bottom',
      });
      (await toast).present();
      this.loading.dismiss();
    }
  }

}
