import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', redirectTo: 'stage', pathMatch: 'full' },
  {
    path: 'stage',
    loadComponent: () => import('./routes/stage/stage.component').then((m) => m.StageComponent),
  },
  {
    path: 'stage/:sceneId',
    loadComponent: () => import('./routes/stage/stage.component').then((m) => m.StageComponent),
  },
  {
    path: 'backstage',
    loadComponent: () =>
      import('./routes/backstage/backstage.component').then((m) => m.BackstageComponent),
  },
  { path: '**', redirectTo: 'stage' },
];
