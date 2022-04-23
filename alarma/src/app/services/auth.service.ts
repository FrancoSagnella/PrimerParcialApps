import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { first } from 'rxjs/operators';
import { User } from '../clases/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLogged: any = false;
  public currentUser: any;
  public user: User;

  constructor(public afAuth: AngularFireAuth){}

  async login(email:string, password:string)
  {
    try{
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.isLogged = true;
      return result;
    }
    catch(e:any){
      console.log(e.code);
      return this.manejarErroresFirebase(e.code);
    }
  }

  async logout(){
    try{
      await this.afAuth.signOut();
      this.isLogged = false;
      return true;
    } catch (e:any) {
      console.log(e.code);
      return this.manejarErroresFirebase(e.code);
    }
  }

  async register(email:string, password:string)
  {
    try{
      const result = await this.afAuth.createUserWithEmailAndPassword(email,password);
      this.isLogged = true;
      return result;
    }
    catch(e:any){
      console.log(e.code);
      return this.manejarErroresFirebase(e.code);
    }
  }

  getCurentUser(){
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  manejarErroresFirebase(code:any)
  {
    let ret:String = '';
    switch(code)
    {
      case 'auth/email-already-exists':
      case 'auth/email-already-in-use':
        ret = 'El mail ingresado ya pertenece a una cuenta!';
        break;
      case 'auth/internal-error':
        ret = 'Ocurrió un error inesperado!';
        break;
      case 'auth/invalid-email':
        ret = 'El formato del mail no es válido!';
        break;
      case 'auth/missing-email':
      case 'auth/missing-password':
        ret = 'Se deben ingresar datos!';
        break;
      case 'auth/invalid-password':
      case 'auth/weak-password':
        ret = 'La contraseña debe terner al menos 6 caracteres!';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        ret = 'Email y/o contraseña inválidos!';
        break;
    }
    return ret;
  }
}
