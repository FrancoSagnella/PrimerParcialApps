import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Mensaje } from '../mensaje';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat4b',
  templateUrl: './chat4b.component.html',
  styleUrls: ['./chat4b.component.scss'],
})
export class Chat4bComponent implements OnInit {

  public user:any;
  mensaje:Mensaje = {class:'', from:'',message:'',date:'',time:''};

  chat:any[] = [];
  @ViewChild('scrollMe') private listadoMensajes!: ElementRef;

  constructor(private auth:AuthService, private router:Router, private chatService:ChatService) { }

  ngOnInit() {}
  ionViewDidEnter(){
    this.gaurdarUsuario();
    this.chatService.getAll('4B').subscribe((chatSnapshot) => {
      this.chat = [];
      console.info('snapchot', chatSnapshot);
      chatSnapshot.forEach((messageData: any) => {
        this.chat.push({
          id: messageData.payload.doc.id,
          data: messageData.payload.doc.data()
        });
      })
      console.info('chat', this.chat);
      this.scrollear();
    });
    this.scrollear();

  }
  ngAfterViewChecked() {
    this.scrollear();

  }
  scrollear() {
    this.listadoMensajes.nativeElement.scrollTop = this.listadoMensajes.nativeElement.scrollHeight;
  }
  async gaurdarUsuario()
  {
    this.user = await this.auth.getCurentUser();
  }
  logOut()
  {
    this.auth.logout();
    this.router.navigateByUrl('login');
  }

  volver()
  {
    this.router.navigateByUrl('home');

  }

  send() {
    let date: Date = new Date();

    this.mensaje.from = this.user.email;
    this.mensaje.class = '4B';
    this.mensaje.date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();

    let hora = date.getHours();
    let minuto = date.getMinutes();
    let segundo = date.getSeconds().toString();
    if(segundo.length == 1)
    {
      segundo = '0'+segundo;
    }

    this.mensaje.time = hora+':'+minuto+':'+segundo;

    if (this.chatService.checkMessage(this.mensaje)) {
      if (this.chatService.createOne('4B',this.mensaje)) {
        this.clear();
      }
    }
  }

  clear() {
    this.mensaje.message = '';
  }
}
