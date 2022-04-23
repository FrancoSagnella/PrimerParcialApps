import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FotoService } from 'src/app/services/foto.service';
import { LoadingService } from 'src/app/services/loading.service';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit {

  listaLindo:any[] = [];
  listaFeo:any[] = [];
  listaFotos:any[] = [];

  topFeas:any[] = [];
  topFeasUsuario:any[] = [];
  topFeasVotos:any[] = [];
  imgFeas:any[] = [];

  topLindas:any[] = [];
  topLindasUsuario:any[] = [];
  topLindasVotos:any[] = [];
  imgLindas:any[] = [];

  votaciones:any[] = [];

  categoria = '';

  user;

  dataCosasLindas;
  dataCosasFeas;

  imagenSeleccionada;


  mostrarGrafico = true;
  constructor(private menu:MenuController,
              private afs:AngularFirestore,
              private loading:LoadingService,
              private foto:FotoService,
              private auth:AuthService,
              private firestore:FirestoreService) { }

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

    this.topFeas = [];
    this.topLindas = [];

  }

  verGraficoLindas() {
    this.categoria = 'lindas';
    this.loading.present();
    setTimeout(()=>{
      this.armarTorta();
      this.loading.dismiss();
    }, 300);
  }

  verGraficoFeas() {
    this.categoria = 'feas';
    this.loading.present();
    setTimeout(()=>{
      this.armarBarras();
      this.loading.dismiss();
    }, 300);
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

        // ordeno por votos las fotos
        this.listaFeo.sort(function (a, b) {
          if (a.votos > b.votos) {
            return -1;
          }
          if (a.votos < b.votos) {
            return 1;
          }
          return 0;
        });

        this.listaLindo.sort(function (a, b) {
          if (a.votos > b.votos) {
            return -1;
          }
          if (a.votos < b.votos) {
            return 1;
          }
          return 0;
        });

        for(let i=0; i < 5; i++)
        {
          if(typeof(this.listaFeo[i]) != 'undefined')
          {
            this.topFeas.push(this.listaFeo[i]);
            this.topFeasUsuario.push(this.listaFeo[i].usuario);
            this.topFeasVotos.push(this.listaFeo[i].votos);
            this.imgFeas.push(this.listaFeo[i].link);
          }
        }

        for(let i=0; i < 5; i++)
        {
          if(typeof(this.listaLindo[i]) != 'undefined')
          {
            this.topLindas.push(this.listaLindo[i]);
            this.topLindasUsuario.push(this.listaLindo[i].usuario);
            this.topLindasVotos.push(this.listaLindo[i].votos);
            this.imgLindas.push(this.listaLindo[i].link);
          }
        }

      this.loading.dismiss();
      }, 500);

    });
  }

  armarTorta() {
      // this.dataCosasLindas = {
      //   labels: this.topLindasUsuario,
      //   datasets: [{
      //     label: 'Cantidad de votos',
      //     data: this.topLindasVotos,
      //     backgroundColor: [
      //       'rgba(255, 159, 64, 0.2)',
      //       'rgba(255, 99, 132, 0.2)',
      //       'rgba(54, 162, 235, 0.2)',
      //       'rgba(255, 206, 86, 0.2)',
      //       'rgba(75, 192, 192, 0.2)'
      //     ],
      //     hoverBackgroundColor: [
      //       '#FFCE56',
      //       '#FF6384',
      //       '#36A2EB',
      //       '#FFCE56',
      //       '#FF6384'
      //     ]
      //   }]
      // }

      let labels = this.topLindas.map((element) => {
        return 'Foto de: '+element.usuario;
      });
      let data = this.topLindas.map((element) => {
        return element.votos;
      });
      this.dataCosasLindas = {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                  ],
            hoverBackgroundColor: [
                    '#FFCE56',
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#FF6384'
                  ]
          }]
      };
  }

  armarBarras() {

      this.dataCosasFeas = {
        labels: this.topFeasUsuario,
        datasets: [{
          label: 'Cantidad de votos',
          data: this.topFeasVotos,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      }
  }

  selectData(e: any) {
    // let label = ;
    console.log(e.element);
    // this.listaFotos.forEach((imagen) => {
    //   if (imagen.imgName == label) {
    //     this.imagenSeleccionada = imagen;
    //   }
    // });
  }

  volver(){
    this.categoria = '';
  }
}
