import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Auth Interceptor
 * Ensures cookies are sent with every request
 * (Token is stored in httpOnly cookie by backend)
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Clone request to include credentials (cookies)
  // This ensures httpOnly cookies are sent with every request
  const authReq = req.clone({
    withCredentials: true
  });

  return next(authReq);
};
