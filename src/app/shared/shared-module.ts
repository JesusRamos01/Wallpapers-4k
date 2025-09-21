import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input/input/input.component';
import { IonicModule } from '@ionic/angular';
import { ButtonComponent } from './components/button/button/button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from './components/card/card/card.component';
import { FloatingButtonComponent } from './components/button/floating-button/floating-button.component';
import { LinkComponent } from './components/link/link/link.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [InputComponent, ButtonComponent, CardComponent, FloatingButtonComponent, LinkComponent],
  imports: [
    CommonModule, IonicModule,ReactiveFormsModule, FormsModule, RouterModule
  ],
  exports: [InputComponent, ButtonComponent, ReactiveFormsModule, FormsModule, CardComponent, FloatingButtonComponent, LinkComponent, RouterModule],
})
export class SharedModule { }
