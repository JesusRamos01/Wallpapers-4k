import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';


export interface CardAction {
  label: string;
  icon?: string;
  handler?: () => void;
  routerLink?: string;
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent  implements OnInit {

  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() image?: string;
  @Input() actions: CardAction[] = [];
  @Input() routerLink?: string;

  constructor() { }

  ngOnInit() {}

}
