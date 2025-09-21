import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/services/userServices/user';
import { Auth } from 'src/app/core/services/auth/auth';
import { Toast } from 'src/app/core/services/toastService/toast';
import { Router } from '@angular/router';
import { Loading } from 'src/app/core/services/loadingService/loading';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
  standalone: false,
})
export class UpdatePage implements OnInit {
  public name!: FormControl;
  public lastname!: FormControl;
  public email!: FormControl;
  public updateForm!: FormGroup;


  private uid!: string;

  constructor(private userSrv: User, private authSrv: Auth, private toast: Toast, private router: Router, private loadSrv: Loading) {
    this.initForm();

  }

  ngOnInit() {
    this.loadUser();
  }
  private initForm() {
    this.name = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.lastname = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.email = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]);

    this.updateForm = new FormGroup({
      name: this.name,
      lastname: this.lastname,
      email: this.email
    });
  }

  private loadUser() {
    this.userSrv.getCurrentUser().subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.name.setValue(user.name || '');
        this.lastname.setValue(user.lastname || '');
        this.email.setValue(user.email || '');

      }
    });
  }

  public async updateUser() {
    if (this.updateForm.invalid) {
      await this.toast.show('Por favor, llena todos los campos correctamente.');
      return;
    }

    try {
      await this.userSrv.updateUser(this.uid, {
        name: this.name.value,
        lastname: this.lastname.value
      });

      this.loadSrv.present('Updating...');

      await this.toast.show('Usuario actualizado correctamente.');
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      await this.toast.show('Ocurrió un error al actualizar.');
    } finally {
      this.loadSrv.dismiss();
    }
  }

  public atHome() {
    this.router.navigateByUrl('/home');
  }

}
