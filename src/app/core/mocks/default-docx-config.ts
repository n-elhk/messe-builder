import { PageOrientation } from 'docx';
import { DocxConfig } from '../interfaces/document-config';

export const DOCX_CONFIG: DocxConfig = {
  orientation: PageOrientation.LANDSCAPE,
  columnCount: 3,
  churchName: '',
  email: '',
  isOk: false,
};
