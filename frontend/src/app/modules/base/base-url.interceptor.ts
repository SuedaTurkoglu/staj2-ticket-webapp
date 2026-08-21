import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BaseUrlInterceptor implements HttpInterceptor {
  private readonly baseUrl = 'http://localhost:8080/api';

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // do not update the outer requests
    if (req.url.startsWith('http://') || req.url.startsWith('https://') || req.url.startsWith('/assets/')) {
      return next.handle(req);
    }

    // adds / if not exists, cleans the missing / (preventing duplicates at the path)
    const cleanPath = req.url.startsWith('/') ? req.url : `/${req.url}`;
    const apiReq = req.clone({
      url: `${this.baseUrl}${cleanPath}`
    });

    return next.handle(apiReq);
  }
}
