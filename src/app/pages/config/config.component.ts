import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PageOrientation } from 'docx';
import {
  DocxConfig,
  StorageKey,
} from 'src/app/core/interfaces/document-config';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { Router, RouterModule } from '@angular/router';
import { MbButtonComponent } from '../../../components/mb-button/mb-button.component';

@Component({
  selector: 'app-config',
  standalone: true,
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MbButtonComponent],
})
export class ConfigComponent {
  /** Injection of {@link Router}. */
  private storageService = inject(StorageService);

  /** Injection of {@link Router}. */
  private router = inject(Router);

  /** Injection of {@link Router}. */
  private builder = inject(FormBuilder);

  public formConfig = this.builder.group({
    docNameCtrl: new FormControl('', {
      nonNullable: true,
    }),

    orientationCtrl: new FormControl(PageOrientation.LANDSCAPE, {
      nonNullable: true,
      validators: Validators.compose([Validators.required]),
    }),

    columnCtrl: new FormControl(3, {
      nonNullable: true,
      validators: Validators.compose([Validators.required]),
    }),

    churchNameCtrl: new FormControl('', {
      nonNullable: true,
    }),

    emailCtrl: new FormControl('', {
      nonNullable: true,
    }),
  });

  public configChange(): void {
    const config: DocxConfig = {
      orientation: this.formConfig.controls.orientationCtrl.value,
      columnCount: this.formConfig.controls.columnCtrl.value,
      churchName: this.formConfig.controls.churchNameCtrl.value,
      email: this.formConfig.controls.emailCtrl.value,
      isOk: true,
    };
    this.storageService.setStorage<DocxConfig>(StorageKey.DocxConfig, config);

    this.router.navigate(['app']);
  }
}
