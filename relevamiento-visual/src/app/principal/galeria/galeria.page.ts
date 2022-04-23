import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FotoService } from 'src/app/services/foto.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage implements OnInit {

  listaLindo:any[] = [];
  listaFeo:any[] = [];
  listaFotos:any[] = [];

  votaciones:any[] = [];

  categoria = '';

  user;

  constructor(private menu:MenuController, 
    private foto:FotoService, 
    private auth:AuthService,
    private firestore:FirestoreService,
    private loading:LoadingService) { }


  // fotos = this.foto.fotos;
  ngOnInit() {
  }
  
  async ionViewDidEnter() {
    this.loading.present();
    await this.foto.getListadoFotos().then(listado => {
      this.listaFotos = listado;
    });
    await this.foto.getFotosFiltradas('lindo').then(listado => {
      this.listaLindo = listado;
    });
    await this.foto.getFotosFiltradas('feo').then(listado => {
      this.listaFeo = listado;
    });

    this.obtenerVotaciones();
    
    this.auth.afAuth.user.subscribe(user => {
      this.user = user;
    });
  }

  ionViewWillLeave(){
    this.menu.close();
    this.categoria = '';
    this.listaLindo = [];
    this.listaFeo = [];
    this.listaFotos = [];
    this.votaciones = [];
  }

  verListaLindas() {
    this.categoria = 'lindas';
  }

  verListaFeas() {
    this.categoria = 'feas';
  }

  async obtenerVotaciones() {
    this.firestore.obtenerTodos('votaciones').subscribe((imagenesSnapShot) => {

      setTimeout(() => {
        imagenesSnapShot.forEach((response: any) => {
          let imageDate = response.payload.doc.data();
          imageDate['id'] = response.payload.doc.id;
          this.votaciones.push(imageDate);
        });
  
        for (let foto of this.listaFeo){
          for (let voto of this.votaciones){
            if(voto.imagen == foto.imgName)
            {
              foto.votos = voto.cantVotos;
            }
          }
        }
  
        for (let foto of this.listaLindo){
          for (let voto of this.votaciones){
            if(voto.imagen == foto.imgName)
            {
              foto.votos = voto.cantVotos;
            }
          }
        }

        this.listaFeo.sort(function (a, b) {
          if (a.fecha > b.fecha) {
            return -1;
          }
          if (a.fecha < b.fecha) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });

        this.listaLindo.sort(function (a, b) {
          if (a.fecha > b.fecha) {
            return -1;
          }
          if (a.fecha < b.fecha) {
            return 1;
          }
          // a must be equal to b
          return 0;
        });
      this.loading.dismiss();
      }, 500);

    });
  }

  votar(fotografia) {
    let existVote = false;
    let existImg = false;
    let auxVotacion;
    this.votaciones.forEach(votacion => {
      if (fotografia.imgName == votacion.imagen) {
        existImg = true;
        auxVotacion = votacion;//si la encuentro guardo la votacion actual
      }
    });
    if (existImg && auxVotacion) {
      auxVotacion.votos.forEach(voto => {
        voto.usuario == this.user.email ? existVote = true : null;//verifico que no halla votado aun.
      });
      if (!existVote) {//si no voto, agrego el voto
        auxVotacion.cantVotos++;
        this.agregarVotacion(auxVotacion);
        this.foto.presentToast('Voto registrado', 2000, 'success', 'Listo');

      }
      else {
        this.foto.presentToast('Usted ya voto en esta fotografia', 2000, 'warning', 'Doble voto');
      }
    }
  }

  agregarVotacion(imagen: any) { //imagen compuesto { 'imagen': imagen, 'votos': [{ 'usuario': 'admin', 'voto': 'positivo' }, { 'usuario': 'usuario', 'voto': 'negativo' }] }
    imagen.votos.push({ 'usuario': this.user.email});
    this.firestore.actualizar('votaciones', imagen.id, imagen);
    this.obtenerVotaciones();
  }

  volver() {
    this.categoria = '';
  }
}
