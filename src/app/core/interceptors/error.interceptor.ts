import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

// Track if token refresh is in progress
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<boolean>(false);

/**
 * Error Interceptor
 * Handles HTTP errors globally with automatic token refresh
 */
export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const http = inject(HttpClient);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Check if this is a refresh token request
        if (req.url.includes('/auth/refresh')) {
          // Refresh token is also expired, redirect to login
          isRefreshing = false;
          router.navigate(['/auth/login']);
          return throwError(() => error);
        }

        // Skip refresh for login/register endpoints
        if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
          return throwError(() => error);
        }

        // Try to refresh the token
        return handle401Error(req, next, http, router);
      } else if (error.status === 403) {
        // Forbidden - show access denied message
        console.error('Access denied - You do not have permission to access this resource');
      } else if (error.status === 0) {
        // Network error
        console.error('Network error - please check your connection');
      } else if (error.status >= 500) {
        // Server error
        console.error('Server error - please try again later');
      }

      return throwError(() => error);
    })
  );
};

/**
 * Handle 401 error by attempting to refresh the token
 */
function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  http: HttpClient,
  router: Router
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(false);

    // Call refresh endpoint using environment config
    return http.post(
      `${environment.apiUrl}/api/auth/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      switchMap(() => {
        isRefreshing = false;
        refreshTokenSubject.next(true);
        
        // Retry the original request
        return next(request);
      }),
      catchError((error) => {
        isRefreshing = false;
        
        // Refresh failed, redirect to login
        router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  } else {
    // Wait for token refresh to complete
    return refreshTokenSubject.pipe(
      filter(result => result === true),
      take(1),
      switchMap(() => {
        // Retry the original request
        return next(request);
      })
    );
  }
}
