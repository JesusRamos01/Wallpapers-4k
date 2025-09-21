import { Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent  implements OnInit {
  @Input() to!: string; 
  @Input() external = false;
  @Input() target?: string;

  constructor() { }

  ngOnInit() {}

}
