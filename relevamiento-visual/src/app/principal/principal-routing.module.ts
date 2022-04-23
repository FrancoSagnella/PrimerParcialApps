import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadisticasPage } from './estadisticas/estadisticas.page';
import { GaleriaPage } from './galeria/galeria.page';
import { HomePage } from './home/home.page'

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: '**',
    redirectTo: 'principal/home',
    pathMatch: 'full'
  },
  {
    path: 'galeria',
    component: GaleriaPage
  },
  {
    path: 'estadisticas',
    component: EstadisticasPage
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalRoutingModule {}
