import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  temaSeleccionado:string = 'numeros';
  idiomaSeleccionado:string = 'español';
  estaSonando:boolean;

  listaAnimales:any[] = [{nombre:'perro', foto:'./../../assets/perro.png'},
                            {nombre:'gato', foto:'./../../assets/gato.png'},
                            {nombre:'caballo', foto:'./../../assets/caballo.png'},
                            {nombre:'raton', foto:'./../../assets/raton.png'},
                            {nombre:'cerdo', foto:'./../../assets/cerdo.png'},
                            {nombre:'vaca', foto:'./../../assets/vaca.png'}];

  listaColores:any[] = [{nombre:'rojo', foto:'./../../assets/rojo.png'},
                        {nombre:'azul', foto:'./../../assets/azul.png'},
                        {nombre:'amarillo', foto:'./../../assets/amarillo.png'},
                        {nombre:'verde', foto:'./../../assets/verde.png'},
                        {nombre:'celeste', foto:'./../../assets/celeste.png'},
                        {nombre:'violeta', foto:'./../../assets/violeta.png'}];

  listaNumeros:any[] = [{nombre:'1', foto:'./../../assets/1.png'},
                            {nombre:'2', foto:'./../../assets/2.png'},
                            {nombre:'3', foto:'./../../assets/3.png'},
                            {nombre:'4', foto:'./../../assets/4.png'},
                            {nombre:'5', foto:'./../../assets/5.png'},
                            {nombre:'6', foto:'./../../assets/6.png'}];

  constructor(private loading:LoadingService, private authService:AuthService, private router:Router) {}

  ionViewDidEnter() {
    this.temaSeleccionado = 'numeros';
    this.idiomaSeleccionado = 'español';
    this.estaSonando = false;
  }

  cambiarTema(tema) {
    this.temaSeleccionado = tema;
  }

  cambiarIdioma(idioma) {
    this.idiomaSeleccionado = idioma;
  }
  async onLogout(){
    this.loading.present();
    await this.authService.logout();
    this.router.navigateByUrl('login');
    this.loading.dismiss();
  }

  reproducirSonido(tema, idioma, boton){
    if(!this.estaSonando)
    {
      this.estaSonando = true;
      const audio = new Audio('./../../assets/sonidos/'+idioma+'/'+tema+'/'+boton+'.wav');
      audio.play();
      setTimeout(()=>{ this.estaSonando = false}, 500);
    }
  }
}
