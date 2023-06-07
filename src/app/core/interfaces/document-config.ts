import { PageOrientation } from 'docx';

export enum StorageKey {
  DocxConfig = 'docxConfig',
}

export interface DocxConfig {
  orientation: PageOrientation;
  columnCount: number;
  churchName: string;
  churchAddress: string;
  isOk: boolean;
}
