import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mb-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mb-button.component.html',
  styleUrls: ['./mb-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MbButtonComponent {
  @HostBinding('style.color')
  @Input() public color = '';

  @HostBinding('style.background-color')
  @Input() public backgroundColor = '';

  @HostBinding('style.border-color')
  @Input() public borderColor = '';

  @Input() public disabled =  false;
}
