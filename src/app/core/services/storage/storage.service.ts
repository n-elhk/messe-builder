import { Injectable } from '@angular/core';
import { DocxConfig, StorageKey } from '../../interfaces/document-config';
import { DOCX_CONFIG } from '../../mocks/default-docx-config';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public resetStorage(key: StorageKey): void {
    this.setStorage(key, DOCX_CONFIG);
  }

  public reOpenConfig(): void {
    const docxConfig = this.getStorage<DocxConfig>(StorageKey.DocxConfig);
    docxConfig.isOk = false;

    this.setStorage(StorageKey.DocxConfig, docxConfig);
  }

  public getStorage<T>(key: StorageKey): T {
    try {
      const ls = localStorage.getItem(key);
      if (ls) {
        return JSON.parse(ls) as T;
      }
      throw new Error(`No storage ${key} founded`);
    } catch (error) {
      this.resetStorage(key);
      return this.getStorage(key);
    }
  }

  public setStorage<T>(key: StorageKey, st: T): void {
    localStorage.setItem(key, JSON.stringify(st));
  }
}
