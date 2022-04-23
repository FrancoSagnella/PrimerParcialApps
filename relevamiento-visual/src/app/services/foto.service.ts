import { Injectable } from '@angular/core';
// import { CameraSource } from '@capacitor/camera';
// import {Plugins, Capacitor} from '@capacitor/core';
// import {CameraResultType, CameraPhoto, CameraSource} from '@capacitor/camera';
import { Foto } from '../clases/foto';
import { FirestoreService } from './firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Camera, CameraOptions} from '@ionic-native/camera/ngx';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';
// const {Camera, Filesystem, Storage} = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FotoService {

  // public fotos: Foto[] = [];
  imagen: string;
  nombreImagen: string;
  pathImagen: any;
  storageRef = this.angularFireStorage.storage.ref();
  currentUser;

  public listaFotos:any[] = [];

  public fotosLindas:any[] = [];
  public fotosFeas:any[] = [];

  constructor(private firestore:FirestoreService,
              private auth:AuthService,
              private camara:Camera,
              private angularFireStorage: AngularFireStorage,
              private toast: ToastController,
              private loading: LoadingService) { 
                this.auth.afAuth.user.subscribe(user => {
                  this.currentUser = user;
                });
              }

  
  sacarFoto(galery:string) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camara.DestinationType.DATA_URL,
      encodingType: this.camara.EncodingType.JPEG,
      mediaType: this.camara.MediaType.PICTURE
    }

    this.loading.present();
    this.camara.getPicture(options).then((imageData) => {
      this.imagen = 'data:image/jpeg;base64,'+imageData;
      this.armarNombreImagen(this.currentUser.email, new Date().getTime(), galery);
      this.guardarFotoEnStorage();
      this.firestore.crear('votaciones', { 'imagen' : this.nombreImagen, 'votos': [], 'cantVotos' : 0 });
    this.loading.dismiss();

    }, (err) => {
      this.presentToast(err, 2000, 'danger', 'ERROR');
    this.loading.dismiss();

    });
  }

  armarNombreImagen(usuario:string, fecha: number, tipo:string){
    this.nombreImagen = this.currentUser.email + '_' + fecha + '_' + tipo + '.jpg';
    this.pathImagen = this.storageRef.child(this.currentUser.email + '_' + fecha + '_' + tipo + '.jpg');
  }

  desarmarNombreImagen(imgName: string, link: string) {
    let datos = imgName.split('_');
    let user = datos[0];
    let date = new Date(parseInt(datos[1]));
    let fecha = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    let tipo = datos[2].split('.')[0];
    let archivo = { 'fecha': fecha, 'link': link, 'usuario': user, 'tipo': tipo, 'imgName': imgName }
    return archivo;
  }

  guardarFotoEnStorage() {
    this.pathImagen.putString(this.imagen, 'data_url').then((response) => {
      this.presentToast("La imagen se subio", 2000, 'success', 'imagen subida');
    });
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

  async getListadoFotos():Promise<any> {
    let auxLista = [];
    await this.angularFireStorage.storage.ref().listAll().then((lista) => {
      lista.items.forEach(item => {
        item.getDownloadURL().then((link) => {
          let archivo = this.desarmarNombreImagen(item.name, link);
          auxLista.push(archivo);
          });
        });
      });
      return auxLista;
  }

  async getFotosFiltradas(filtro:string):Promise<any> {
    let auxLista = [];
    await this.angularFireStorage.storage.ref().listAll().then((lista) => {
      lista.items.forEach(item => {
        item.getDownloadURL().then((link) => {
          let archivo = this.desarmarNombreImagen(item.name, link);
          if(archivo.tipo == filtro)
          {
            auxLista.push(archivo);
          }
          // ver de ordenarlas
          });
        });
      });
      return auxLista;
  }

}
