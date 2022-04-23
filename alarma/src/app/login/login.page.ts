import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from '../clases/user';
import { Input } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { LoadingService } from '../services/loading.service';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @Input() listaUsuarios = [{ "id": 1, "email": "admin@admin.com", "password": "111111", "perfil": "admin", "sexo": "femenino", "name": "admin" },
  { "id": 2, "email": "invitado@invitado.com", "password": "222222", "perfil": "invitado", "sexo": "femenino", "name": "invitado" },
  { "id": 3, "email": "usuario@usuario.com", "password": "333333", "perfil": "usuario", "sexo": "masculino", "name": "usuario" },
  { "id": 4, "email": "anonimo@anonimo.com", "password": "444444", "perfil": "usuario", "sexo": "masculino", "name": "anonimo" },
  { "id": 5, "email": "tester@tester.com", "password": "555555", "perfil": "tester", "sexo": "femenino", "name": "tester" }]
  @Input() user: User = new User();
  @ViewChild('mailsContainer') myButton:ElementRef;
  mailsListed:boolean = false;
  
  // public users:any = [];
  constructor(
    private authService: AuthService,
    private toast: ToastController,
    private router: Router,
    private firestore:FirestoreService,
    public loading:LoadingService,
    private renderer:Renderer2) { }

  ngOnInit() {
    // this.firestore.obtenerTodos('usuarios').subscribe((usersSnapshot) => {
    //   this.users = [];
    //   usersSnapshot.forEach((userData: any) => {
    //     this.users.push({
    //       id: userData.payload.doc.id,
    //       data: userData.payload.doc.data()
    //     });
    //   })
    // });
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
      this.presentToast("Cuenta creada!", 3000, "success", "");
      this.router.navigateByUrl('/home');
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
      this.presentToast("Iniciaste sesion!", 3000, "success", "");
      this.router.navigateByUrl('/home');
      this.loading.dismiss();
    }
    else {
      this.presentToast(response, 3000, "warning", '');
      this.loading.dismiss();
    }
  }

  mostrarMails()
  {
    if(this.mailsListed)
    {
      this.renderer.setAttribute(document.getElementById('flecha'), "name", "arrow-down");
      // this.renderer.addClass(this.myButton.nativeElement, "clase");
      this.renderer.setStyle(document.getElementById('mailsContainer'), 'display', 'none');
      this.renderer.removeStyle(document.getElementById('icono'), 'display');
      this.mailsListed = false;
    }
    else
    {
      this.renderer.setAttribute(document.getElementById('flecha'), "name", "arrow-up");
      this.renderer.removeStyle(document.getElementById('mailsContainer'), 'display');
      this.renderer.setStyle(document.getElementById('icono'), 'display', 'none');
      this.mailsListed = true;
    }
  }
}
