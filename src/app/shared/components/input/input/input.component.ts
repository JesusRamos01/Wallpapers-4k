import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
type InputType = 'text' | 'password' | 'email' | 'number';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: false,
})


export class InputComponent  implements OnInit {
  @Input() type: InputType = 'text';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() label: string = '';
  @Input() readonly: boolean = false; 
  @Input() control: FormControl = new FormControl( );

  constructor() { }

  ngOnInit() {}

  public doWrite(event: any) {
    this.control.setValue(event.target.value);
  }

}
