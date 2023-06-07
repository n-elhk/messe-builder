import { Component } from '@angular/core';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';

@Component({
  selector: 'mb-stepper',
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }],
  standalone: true,
  imports: [NgTemplateOutlet, CdkStepperModule, NgFor, NgIf],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent extends CdkStepper {
  public selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }
}
