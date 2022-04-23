import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FotoService } from 'src/app/services/foto.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private menu:MenuController, private foto:FotoService) {}

  ionViewDidEnter() {
  }

  ionViewWillLeave(){
    this.menu.close();
  }

  newFoto(galeria:string): void {
    
    this.foto.sacarFoto(galeria);
  }

  
}
