import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  signal,
  OnInit,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { distinctUntilChanged, map, of, startWith, switchMap, tap } from 'rxjs';
import { ApiService } from '../../core/services/api/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Messe } from '../../core/interfaces/aelf';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { StateService } from '../../core/services/state/state.service';
import { untilDestroyed } from '../../common/functions/destroye-ref';
import { DocxService } from '../../core/services/docx/docx.service';
import { Packer } from 'docx';
import { StorageService } from 'src/app/core/services/storage/storage.service';
import { ChantInputComponent } from 'src/app/components/chant-input/chant-input.component';
import { SvgIcon } from 'src/app/components/icon/icon';
import { MbButtonComponent } from 'src/app/components/mb-button/mb-button.component';

@Component({
  selector: 'messe-document',
  standalone: true,
  templateUrl: './messe-document.component.html',
  styleUrls: ['./messe-document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DragDropModule,
    ChantInputComponent,
    MbButtonComponent,
    SvgIcon,
  ],
  providers: [DatePipe],
})
export class MesseDocumentComponent implements OnInit {
  private untilDestroyed = untilDestroyed();

  /** Injection of {@link DocxService}. */
  public docxService = inject(DocxService);

  /** Injection of {@link DatePipe}. */
  public datePipe = inject(DatePipe);

  /** Injection of {@link ApiService}. */
  public aelfService = inject(ApiService);

  /** Injection of {@link StateService}. */
  public stateService = inject(StateService);

  /** Injection of {@link StorageService}. */
  public storageService = inject(StorageService);

  /** Injection of {@link FormBuilder}. */
  public builder = inject(FormBuilder);

  /** Index of the selected mass. */
  public massIndex = signal(0);

  /** Current value is the current date. */
  public messeDateCtrl = new FormControl(this.getCurrentDate(), {
    nonNullable: true,
    validators: Validators.compose([Validators.required]),
  });

  public masses = toSignal(
    this.messeDateCtrl.valueChanges.pipe(
      startWith(this.messeDateCtrl.value),
      distinctUntilChanged(),
      switchMap((value) => {
        if (value) {
          return this.aelfService.getMasses(value);
        }
        return of({ messes: [] as Messe[] });
      }),

      map(({ messes }) => messes)
    ),
    { initialValue: [] }
  );

  /** Names of the different type of mass in one day. */
  public massesNames = computed(() => this.masses().map(({ nom }) => nom));

  public currentMass = computed<Messe | undefined>(
    () => this.masses()[this.massIndex()]
  );

  public currentMass$ = toObservable(this.currentMass);

  /** Input songs list. */
  public songs = this.stateService.songs;

  /** Items to display in drag and drop list. */
  public items = this.stateService.items;

  public ngOnInit(): void {
    this.currentMass$
      .pipe(
        tap((currentMass) => this.stateService.readingChanged(currentMass)),
        this.untilDestroyed()
      )
      .subscribe();
  }

  /**
   *
   * @returns yyyy-mm-dd.
   */
  public getCurrentDate(date = new Date()): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.getMonth().toString().padStart(2, '0');
    const years = date.getFullYear().toString();

    return `${years}-${month}-${day}`;
  }

  public removeItem(id: string): void {
    this.stateService.removeSong(id);
    this.stateService.removeItem(id);
  }

  public drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.items(), event.previousIndex, event.currentIndex);
  }

  createFilename(): string {
    if (this.messeDateCtrl.value) {
      const date = this.datePipe.transform(
        this.messeDateCtrl.value,
        'dd-MM-YYYY'
      );
      return `feuillet-de-messe-${date}`;
    }

    const date = this.datePipe.transform(new Date(), 'dd-MM-YYYY');
    return `feuillet-de-chants-${date}`;
  }

  public async downloadDocx(): Promise<void> {
    const fileName = this.createFilename();
    const doc = this.docxService.create(this.stateService.items());

    try {
      const blob = await Packer.toBlob(doc);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = `${fileName}.docx`;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      console.log('Document created successfully');
    } catch (error) {
      console.error('Download failed: ', error);
    }
  }
}
