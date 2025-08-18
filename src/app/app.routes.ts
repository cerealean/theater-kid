import { Routes } from '@angular/router';
import { TheaterShell } from './routes/theater/theater.shell';

export const routes: Routes = [
  {
    path: '',
    component: TheaterShell,
    children: [
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
    ],
  },
  { path: '**', redirectTo: '' },
];
