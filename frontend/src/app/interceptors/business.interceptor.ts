import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class BusinessInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const urlSegments = this.router.url.split('/');
    const businessIndex = urlSegments.indexOf('business');

    let businessId: string | null = null;

    if (businessIndex !== -1) {
      businessId = urlSegments[businessIndex + 1];
    }

    if (!businessId) {
      return next.handle(req);
    }

    const cloned = req.clone({
      setHeaders: {
        'x-business-id': businessId
      }
    });

    return next.handle(cloned);
  }
}
