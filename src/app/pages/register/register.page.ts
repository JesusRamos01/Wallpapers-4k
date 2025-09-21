import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Auth } from 'src/app/core/services/auth/auth';
import { Query } from 'src/app/core/services/queryService/query';
import { Router } from '@angular/router';
import { Toast } from 'src/app/core/services/toastService/toast';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  public name!: FormControl;
  public lastname!: FormControl;
  public email!: FormControl;
  public password!: FormControl;
  public confirmPassword!: FormControl;

  public registerForm!: FormGroup;


  constructor(private readonly authSrv: Auth, private readonly querySrv: Query, private readonly router: Router, private readonly toast: Toast) {
    this.initForm();
  }

  ngOnInit() {
  }

  public async doRegister() {

    const uid = await this.authSrv.register(this.email.value, this.password.value);
    await this.querySrv.create("users", {
      name: this.name.value,
      lastname: this.lastname.value,
    }, uid);

    this.router.navigate(['/home']);
    this.toast.show('Registro exitoso, bienvenido!', "center");

  }

  private initForm() {
    this.name = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.lastname = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.confirmPassword = new FormControl('', [Validators.required, Validators.minLength(6)]);

    this.registerForm = new FormGroup({
      name: this.name,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword
    });
  }

}
