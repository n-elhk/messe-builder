import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'mb-root',
  standalone: true,
  imports: [
    NgIf,
    HeaderComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
