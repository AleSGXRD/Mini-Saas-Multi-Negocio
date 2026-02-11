import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const businessInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const urlSegments = router.url.split('/');
  const businessIndex = urlSegments.indexOf('business');

  let businessId: string | null = null;

  if (businessIndex !== -1) {
    businessId = urlSegments[businessIndex + 1];
  }

  if (!businessId) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      'x-business-id': businessId
    }
  });

  return next(cloned);
};
