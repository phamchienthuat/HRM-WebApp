import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

/**
 * Auth Guard for HttpOnly Cookie Authentication
 * 
 * Since httpOnly cookies cannot be accessed via JavaScript,
 * this guard checks if user data exists in localStorage,
 * which is set after successful authentication.
 * 
 * Usage:
 * ```typescript
 * {
 *   path: 'dashboard',
 *   component: DashboardComponent,
 *   canActivate: [authGuard]
 * }
 * ```
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  
  // Check if user data exists in localStorage
  // (This is set by AuthService after successful login)
  const userDataStr = localStorage.getItem('user');
  
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      
      // Basic validation: check if user object has required properties
      if (userData && userData.id && userData.email) {
        // User is authenticated, allow access
        return true;
      }
    } catch (error) {
      // Invalid JSON in localStorage, clear it
      localStorage.removeItem('user');
    }
  }
  
  // User is not authenticated, redirect to login
  // Store the attempted URL for redirecting after login
  const returnUrl = state.url;
  
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl },
    queryParamsHandling: 'merge'
  });
  
  return false;
};

/**
 * Guest Guard (Inverse of Auth Guard)
 * Prevents authenticated users from accessing login/register pages
 * 
 * Usage:
 * ```typescript
 * {
 *   path: 'login',
 *   component: LoginComponent,
 *   canActivate: [guestGuard]
 * }
 * ```
 */
export const guestGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  
  // Check if user data exists in localStorage
  const userDataStr = localStorage.getItem('user');
  
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      
      // User is authenticated, redirect to dashboard
      if (userData && userData.id && userData.email) {
        router.navigate(['/dashboard']);
        return false;
      }
    } catch (error) {
      // Invalid JSON in localStorage, clear it
      localStorage.removeItem('user');
    }
  }
  
  // User is not authenticated, allow access to login/register
  return true;
};
