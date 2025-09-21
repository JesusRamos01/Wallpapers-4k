import { Component, OnInit, Input, Output } from '@angular/core';

import { EventEmitter } from '@angular/core';

export interface FloatingAction {
  icon: string;
  label?: string;
  routerLink?: string;
  handler?: () => void;
}

@Component({
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.scss'],
  standalone: false,
})
export class FloatingButtonComponent  implements OnInit {

  @Input() icon = 'add';
  @Input() position: 'bottom-end'|'bottom-start'|'top-end'|'top-start' = 'bottom-end';
  @Input() actions: FloatingAction[] = [];
  @Output() action = new EventEmitter<{ action: FloatingAction, index: number }>();
  constructor() { }

  ngOnInit() {}

  get vertical() { return this.position.startsWith('top') ? 'top' : 'bottom'; }
  get horizontal() { return this.position.includes('start') ? 'start' : 'end'; }

  onAction(a: FloatingAction, i: number, ev?: Event) {
    ev?.stopPropagation();
    if (a.handler) a.handler();
    this.action.emit({ action: a, index: i });
  }

}
