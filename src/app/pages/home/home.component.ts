import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SvgIcon } from 'src/app/components/icon/icon';
import { MbButtonComponent } from 'src/app/components/mb-button/mb-button.component';

@Component({
  selector: 'mb-home',
  standalone: true,
  imports: [SvgIcon, MbButtonComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
