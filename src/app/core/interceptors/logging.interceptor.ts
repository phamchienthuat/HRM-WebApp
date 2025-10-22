import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

/**
 * Logging Interceptor
 * Logs HTTP requests and responses (only in development)
 */
export const loggingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (!environment.enableLogging) {
    return next(req);
  }

  const started = Date.now();
  let status = 'pending';

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          status = 'success';
          const elapsed = Date.now() - started;
          console.log(`%c[HTTP] ${req.method} ${req.url}`, 'color: #4CAF50', {
            status: event.status,
            duration: `${elapsed}ms`,
            response: event.body,
          });
        }
      },
      error: (error) => {
        status = 'failed';
        const elapsed = Date.now() - started;
        console.error(`%c[HTTP ERROR] ${req.method} ${req.url}`, 'color: #f44336', {
          status: error.status,
          duration: `${elapsed}ms`,
          error: error.error,
        });
      },
    })
  );
};
