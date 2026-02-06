import { Routes } from '@angular/router';
import { catchAllRoute, ClerkAuthGuardService } from 'ngx-clerk';
import { UserProfilePageComponent } from './pages/user-profile-page/user-profile-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
  {
    matcher: catchAllRoute('user'),
    component: UserProfilePageComponent,
    canActivate: [ClerkAuthGuardService],
  },
  {
    path: '',
    component: HomePageComponent
  }
];
