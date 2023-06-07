import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { FooterComponent } from './layout/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'mb-root',
  standalone: true,
  imports: [
    NgIf,
    // StepperComponent,
    // forwardRef(() => StepperComponent),
    FooterComponent,
    HeaderComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
