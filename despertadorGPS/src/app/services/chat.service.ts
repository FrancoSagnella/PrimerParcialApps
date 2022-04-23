import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Mensaje } from '../mensaje';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private toast:ToastController,private bd: AngularFirestore, private firestore:FirestoreService) {}

   public async createOne(coleccion:string,message: Mensaje) {
      const result = await this.firestore.crear(coleccion, message); //  llaves es objeto, 3 puntitos es dinamico
      return result;
  }

  public checkMessage(message: Mensaje): boolean {
    if (message.message.length < 1 || message.message.length > 21) {
      this.presentToast('El mensaje tiene que tener entre 1 y 21 caracteres',2000,'warning');
      return false;
    }
    return true;
  }

  getAll(coleccion:string) {
    const mensajesCollectionRef = this.bd.collection<Mensaje>(coleccion, ref => ref.orderBy('date', 'asc').orderBy('time', 'asc'));
    return mensajesCollectionRef.snapshotChanges();
  }

  async presentToast(mensaje: string, duracion: number, color: string, titulo?: string, boton?: boolean,
    tituloBotonUno?: string, tituloBotonDos?: string, urlUno?: string, urlDos?: string) {
    let toast;
    if (boton) {
      toast = await this.toast.create({
        message: mensaje,
        duration: duracion,
        color: color,
        header: titulo,
      });
    }
    else {
      toast = await this.toast.create({
        message: mensaje,
        duration: duracion,
        color: color,
        header: titulo,
        position: 'top'
      });
    }
    toast.present();
  }
}
