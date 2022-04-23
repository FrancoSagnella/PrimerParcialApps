import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home/home.page';
import { PrincipalRoutingModule } from './principal-routing.module';
import { GaleriaPage } from './galeria/galeria.page';
import { EstadisticasPage } from './estadisticas/estadisticas.page';

import { ChartModule } from 'primeng/chart';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalRoutingModule,
    ChartModule,
  ],
  declarations: [HomePage, GaleriaPage, EstadisticasPage]
})
export class PrincipalModule { }
