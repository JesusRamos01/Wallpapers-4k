import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth/auth';
import { Loading } from 'src/app/core/services/loadingService/loading';
import { Toast } from 'src/app/core/services/toastService/toast';
import { Wallpaper } from 'src/app/shared/services/wallpaperService/wallpaper';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  public email!: FormControl;
  public password!: FormControl;

  public loginForm!: FormGroup;

  constructor(private readonly authSrv: Auth, private readonly router: Router, private readonly toastSrv: Toast, private readonly loadingSrv: Loading) {
    this.initForm();
   }
    
   public async doLogin() {
    try {
      await this.loadingSrv.present('loggin in...');
      await this.authSrv.login(this.email.value, this.password.value);
  
      await this.toastSrv.show('login successful');
      
      this.router.navigateByUrl('/home');
    } catch (error: any) {
      console.error('Error en login:', error);
      this.toastSrv.show('Error en login:', error);
  
      
      await this.toastSrv.show(
        error.message || 'correo o contraseña incorrectos'
      );
    }finally {
      await this.loadingSrv.dismiss();
    }
   }

  private initForm() {
    this.email = new FormControl('',[Validators.required, Validators.email]);
    this.password = new FormControl('',[Validators.required, Validators.minLength(6)]);

    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }
  ngOnInit() {
  }

  public async loginWithGoogle() {
    try {
      await this.authSrv.loginWithGoogle();
      await this.toastSrv.show('Inicio de sesion exitoso');
      this.router.navigateByUrl('/home');
    } catch (error: any) {
      console.error('Error en login con Google:', error);
      await this.toastSrv.show(
        error.message || 'Error al iniciar sesion con Google'
      );
    }
  
  }

}
