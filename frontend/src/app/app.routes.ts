import { Routes } from '@angular/router';
import { catchAllRoute, ClerkAuthGuardService } from 'ngx-clerk';
import { UserProfilePageComponent } from './pages/user-profile-page/user-profile-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { authGuard } from './guards/auth.guard';
import { BusinessPageComponent } from './pages/business-page/business-page.component';

export const routes: Routes = [
  {
    matcher: catchAllRoute('login'),
    component: UserProfilePageComponent,
    canActivate: [ClerkAuthGuardService],
  },
  {
    path: '',
    component: HomePageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'business/:businessId',
    component: BusinessPageComponent,
    canActivate: [authGuard],
  }
];
