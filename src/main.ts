import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app/app.routes';
import { TheaterShell } from './app/routes/theater/theater.shell';

bootstrapApplication(TheaterShell, {
  providers: [provideRouter(routes), provideAnimations(), provideHttpClient(withFetch())],
}).catch(err => console.error(err));
