import { PageOrientation } from 'docx';

export enum StorageKey {
  DocxConfig = 'docxConfig',
}

export interface DocxConfig {
  orientation: PageOrientation;
  columnCount: number;
  churchName: string;
  email: string;
  isOk: boolean;
}
