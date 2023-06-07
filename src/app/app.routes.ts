import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { DocxConfig, StorageKey } from './core/interfaces/document-config';
import { StorageService } from './core/services/storage/storage.service';

const canUseApp = () => {
  const router = inject(Router);
  const storageService = inject(StorageService);
  return storageService.getStorage<DocxConfig>(StorageKey.DocxConfig).isOk
    ? true
    : router.createUrlTree(['config']);
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(
        ({ HomeComponent }) => HomeComponent
      ),
  },
  {
    path: 'config',
    loadComponent: () =>
      import('./pages/config/config.component').then(
        ({ ConfigComponent }) => ConfigComponent
      ),
  },
  {
    path: 'app',
    canActivate: [() => canUseApp()],
    loadComponent: () =>
      import('./pages/messe-document/messe-document.component').then(
        ({ MesseDocumentComponent }) => MesseDocumentComponent
      ),
  },
  {
    path: 'mentions-legales',
    loadComponent: () =>
      import('./pages/mentions-legales/mentions-legales.component').then(
        ({ MentionsLegalesComponent }) => MentionsLegalesComponent
      ),
  },
];
