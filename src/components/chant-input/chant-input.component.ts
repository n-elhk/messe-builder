import { NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteModule } from '../autocomplete/autocomplete.module';
import { LectureType } from 'src/app/core/interfaces/aelf';
import { StateService } from 'src/app/core/services/state/state.service';
import { tap } from 'rxjs';
import { FilterPipe } from '../../app/common/pipes/filter.pipe';

export enum Category {
  SONG = 'SONG',
  READING = 'READING',
}
export interface Song {
  id: string;
  category: Category.SONG;
  name: string;
  title: string;
  value: string;
}

export interface Lecture {
  id: string;
  category: Category.READING;
  name: string;
  type: LectureType;
  title: string;
  value: string;
}

export type Item = Lecture | Song;

@Component({
  selector: 'chant-input',
  standalone: true,
  templateUrl: './chant-input.component.html',
  styleUrls: ['./chant-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgForOf, AutocompleteModule, ReactiveFormsModule, NgIf, FilterPipe],
})
export class ChantInputComponent {
  public apiService = inject(ApiService);

  public stateService = inject(StateService);

  @Input() public song = '';

  @Input() public editable = true;

  @Input() public removable = true;

  @Input() public index = 0;

  public control = new FormControl('', { nonNullable: true });

  public chantsName = signal(Array.from(this.apiService.songConfigs.keys()));

  addSong(song: string): void {
    const songConfigs = this.apiService.songConfigs.get(song);
    if (songConfigs) {
      this.apiService
        .getChant(songConfigs)
        .pipe(
          tap((lycrics) => {
            this.stateService.addItem({
              title: '',
              value: lycrics,
              id: `song_${this.index}`,
              name: song,
              category: Category.SONG,
            });
          })
        )
        .subscribe();
    }
  }

  addLine(): void {
    this.stateService.addSong();
  }

  removeSong() {}
}
