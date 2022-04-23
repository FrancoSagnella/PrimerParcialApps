import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Recarga } from '../clases/recarga';

@Injectable({
  providedIn: 'root'
})
export class RecargasService {

  pathOfCollection = '/recargas-qr';
  referenceToCollection: AngularFirestoreCollection;

  constructor(private afs:AngularFirestore, private toast:ToastController) {
    this.referenceToCollection = this.afs.collection<Recarga>(this.pathOfCollection, ref => ref.orderBy('date', 'asc'));
  }

  // me recibe una recarga (con su codigo, su valor, el usuario, la fecha) y la sube a la bd
  create(recarga: Recarga) {
    try {
      //con esto puedo crear un id para la bd
      recarga.id = this.afs.createId();
      this.referenceToCollection.doc(recarga.id).set({ ...recarga });
      this.presentToast('Recarga exitosa!', 2000 ,'success');
    }
    catch (error) { this.presentToast('Error al cargar el crédito!', 2000 ,'danger'); }
  }

  delete(recarga: Recarga) {
    try {
      console.log(recarga.id);

      // me borra un id especifico
      this.referenceToCollection.doc(recarga.id).delete();
      this.presentToast('Crédito eliminado!', 2000 ,'warning');
    }
    catch (error) { this.presentToast('Error al eliminar el crédito!', 2000 ,'danger'); }
  }

  set(recarga: Recarga) {
    try {
      this.referenceToCollection.doc(recarga.id).set({ ...recarga });
      this.presentToast('Crédito modificado exitosamente!', 2000 ,'success');
    }
    catch (error) { this.presentToast('Error modificando!', 2000 ,'danger'); }
  }

  // me filtra todas las recargas y devuelve solo las de mi usuario actual
  getByUser(email: string) {
    try {
      return this.getAll().pipe(
        map(recargas => recargas.filter(
          recarga => recarga.email.includes(email)))
      );
    }
    catch (error) { this.presentToast('Error obteniendo los datos!', 2000 ,'danger'); }
  }

  // me trae todas las recargas
  getAll() {
    try {
      return this.referenceToCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => a.payload.doc.data() as Recarga))
      );
    }
    catch (error) { this.presentToast('Error obteniendo los datos!', 2000 ,'danger'); }
  }

  // trae todas las recargas y me las filtra con el usuario y el codigo de recarga
  getByUserAndCode(r: Recarga) {
    try {
      return this.getAll().pipe(
        map(recargas => recargas.filter(
          recarga => recarga.email.includes(r.email),
          recarga => recarga.code.includes(r.code)
        ))
      );
    }
    catch (error) { }
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
        header: titulo
      });
    }
    toast.present();
  }
}
