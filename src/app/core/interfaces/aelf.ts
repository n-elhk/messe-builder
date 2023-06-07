export interface Aelf {
  messes: Messe[];
}

export interface Lecture {
  type: LectureType;
  refrain_psalmique: string;
  ref_refrain: null;
  titre: string | null;
  contenu: string;
  ref: string;
  intro_lue: string;
  verset_evangile: string;
  ref_verset: null;
}

export interface Messe {
  nom: string;
  lectures: Lecture[];
}

export type LectureType =
  | 'lecture_1'
  | 'lecture_2'
  | 'psaume'
  | 'evangile'
  | 'sequence';
