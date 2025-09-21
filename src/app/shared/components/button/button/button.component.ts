import { Component, OnInit, Input } from '@angular/core';

type typeButton = 'button' | 'submit' ;

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: false,
})
export class ButtonComponent  implements OnInit {
  @Input() text!: string;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() color: string = 'primary';
  @Input() icon?: string;
  constructor() { }

  ngOnInit() {}

}
