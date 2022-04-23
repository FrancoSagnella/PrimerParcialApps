import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RecargasService } from '../services/recargas.service';
import { Recarga } from '../clases/recarga';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController, ToastController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


  credits: Recarga[];
  email: string;

  myCredits = [
    { code: "8c95def646b6127282ed50454b73240300dccabc", value: 10 },
    { code: "ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ", value: 50 },
    { code: "2786f4877b9091dcad7f35751bfcf5d5ea712b2f", value: 100 }
  ]

  constructor(private auth:AuthService,
    private router:Router,
    private recargas:RecargasService,
    private toast:ToastController,
    private loading:LoadingService,
    private alert:AlertController) {}

  ionViewDidEnter() {
    // cada vez que entro, agarro de la bd las recargas
    this.loading.present();
    this.getRecargas();
    this.loading.dismiss();
  }

  onLogout(){
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  getRecargas() {
    // recupero los datos del usuario
    this.loading.present();
    this.auth.afAuth.user.subscribe(user => {
      if (user && user.email) {
        // recupero las recargas que tiene hechas este usuario
        this.recargas.getByUser(user.email).subscribe(credits => {
          this.email = user.email;
          this.credits = credits;
        });
      }
      this.loading.dismiss();
    });
  }

  // agarra el array de creditos que se trajeron de la bd, y los acumula
  getAcum() {
    let acum = 0;

    try {
      this.credits.forEach(credit => {
        console.log(credit);
        acum += credit.value;
      });
    } catch (error) { }

    // this.styleAcum();
    // this.styleBtn();
    return acum;
  }

  styleAcum() {
    let doc = document.getElementById('acum');

    if (doc.innerHTML.toString() == "$0") { doc.style.color = 'red'; }
    else if (doc.innerHTML.toString() == "$10") { doc.style.color = 'yellow'; }
    else { doc.style.color = 'green'; }
  }

  styleBtn() {
    let doc: any = document.getElementById('acum');

    if (doc.innerHTML.toString() == "$0") {
      doc = document.getElementById('btn');
      doc.disabled = true;
    }
    else {
      doc = document.getElementById('btn');
      doc.disabled = false;
    }
  }

  scanCode() {
    let auxCredit;

    // escanea el codigo qr
    this.loading.present();
    BarcodeScanner.scan().then(barcodeData => {
      this.myCredits.forEach(data => {
        // myCredits va a tener el codigo qr y el valor del mismo
        // le sumo a esos datos la fecha y el usuario que la realizo
        if (data.code == barcodeData.text) {
          auxCredit = data;
          auxCredit.email = this.email;
          auxCredit.date = new Date;
        }
      });

      if (auxCredit) {
        if(this.email != 'admin@admin.com')
        {
          this.credits.forEach(c => {
            if (c.code == auxCredit.code)
            {
              auxCredit = null;
            }
          });
          // si se escaneo bien el credito, y se guardaron bien los datos dentro de auxCredit, se sube a la bd la recarga
          if (auxCredit)
          {
            this.recargas.create(auxCredit);
          }
          else
          {
            this.presentToast('Ya hiciste esta recarga!', 2000 ,'danger');
          }
        }
        else {
          let cont = 0;
          this.credits.forEach(c => {
            if (c.code == auxCredit.code)
            {
              cont = cont+1;
            }
          });
          if(cont >= 2)
          {
            auxCredit = null;
          }
          // si se escaneo bien el credito, y se guardaron bien los datos dentro de auxCredit, se sube a la bd la recarga
          if (auxCredit)
          {
            this.recargas.create(auxCredit);
          }
          else
          {
            this.presentToast('Siendo admin no podés cargar mas de dos veces!', 2000 ,'danger');
          }
        }

      }
      else
      {
        this.presentToast('Codigo QR inválido!', 2000 ,'danger');
      }
      this.loading.dismiss();
    });
  }


  // elimino de la bd las recargas que tengo guardadas
  async retry() {
    const alert = await this.alert.create({
      header:'Borrando crédito',
      message: '¿Estás seguro de borrar todo tu crédito?',
      buttons: [
        {
          text: 'Cancelar',
        },{
          text: 'Confirmar',
          handler: () => {
            this.credits.forEach(data => {
              this.recargas.delete(data);
            });
          }
        }
      ]
    });

    await alert.present();
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
