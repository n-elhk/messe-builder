import { Injectable, signal } from '@angular/core';

import {
  Category,
  Lecture as CustomLecture,
  Song,
} from 'src/components/chant-input/chant-input.component';
import type { Messe } from '../../interfaces/aelf';
import { LECTURE_TYPE } from '../../translation/translation';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public items = signal<(Song | CustomLecture)[]>([]);

  public songs = signal([{ name: '', id: '' }]);

  public addItem(song: Song | CustomLecture) {
    const index = this.items().findIndex((item) => item.id === song.id);
    if (index === -1) {
      this.items.mutate((list) => list.push(song));
    } else {
      this.updateItem(index, song);
    }
  }

  public updateItem(index: number, item: Song | CustomLecture): void {
    this.items.update((list) => {
      list[index] = item;
      return list;
    });
  }

  public removeItem(id: string): void {
    this.items.update((items) => items.filter((item) => item.id !== id));
  }

  public addSong(): void {
    this.songs.mutate((list) => list.push({ name: '', id: '' }));
  }

  public updateSong(index: number, id: string, songName: string): void {
    this.songs.update((list) => {
      list[index] = { name: songName, id };
      return list;
    });
  }

  public removeSong(id: string): void {
    this.songs.update((songs) => {
      if (songs.length === 1) {
        const index = songs.findIndex((song) => song.id === id);
        songs[index] = { id: '', name: '' };
        return songs;
      }
      return songs.filter((song) => song.id !== id);
    });
  }

  public readingChanged(currentMass: Messe | undefined) {
    this.items.update((songs) => {
      const filtered = songs.filter((e) => e.category !== 'READING');
      if (currentMass === undefined) {
        return filtered;
      }

      const lectures = currentMass.lectures.map((lecture, i) => {
        const ref =
          lecture.type === 'psaume' ? lecture.ref.split(',')[0] : lecture.ref;

        return {
          title: lecture.titre ?? '',
          category: Category.READING,
          id: `reading_${i}`,
          name: `${LECTURE_TYPE[lecture.type]} ${ref}`,
          type: lecture.type,
          value: lecture.contenu,
        };
      });
      filtered.push(...lectures);

      return filtered;
    });
  }
}
