import { Injectable, signal } from '@angular/core';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BaseHttpService } from '../../../core/services/http.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  email: string;
  username: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
  };
}

export interface MeResponse {
  success: boolean;
  data: {
    user: UserData;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserData | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated = signal(false);

  constructor(
    private http: BaseHttpService,
    private router: Router
  ) {
    this.loadUserFromStorage();
    this.checkAuthStatus();
  }

  /**
   * Login user - Token is stored in httpOnly cookie by backend
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      '/api/auth/login', 
      credentials,
      { withCredentials: true } // Important: Send cookies
    ).pipe(
      tap(response => {
        if (response.success) {
          this.setAuthData(response.data.user);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user - Clears cookies on backend
   */
  logout(): Observable<any> {
    return this.http.post(
      '/api/auth/logout',
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.clearAuthData();
        this.router.navigate(['/auth/login']);
      }),
      catchError(error => {
        // Even if logout fails, clear local data
        this.clearAuthData();
        this.router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh tokens - Backend will send new cookies
   */
  refreshTokens(): Observable<any> {
    return this.http.post(
      '/api/auth/refresh',
      {},
      { withCredentials: true }
    ).pipe(
      catchError(error => {
        // If refresh fails, user needs to login again
        this.clearAuthData();
        this.router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get current user profile from backend
   */
  getCurrentUser(): Observable<MeResponse> {
    return this.http.get<MeResponse>(
      '/api/auth/me',
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.success) {
          this.setAuthData(response.data.user);
        }
      }),
      catchError(error => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  /**
   * Load user data from localStorage on app initialization
   */
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user: UserData = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }

  /**
   * Check if user is authenticated by calling /auth/me
   */
  checkAuthStatus(): void {
    this.getCurrentUser().subscribe({
      next: (response) => {
        this.isAuthenticated.set(true);
      },
      error: () => {
        this.isAuthenticated.set(false);
      }
    });
  }

  /**
   * Set user data in memory and localStorage
   */
  private setAuthData(user: UserData): void {
    this.currentUserSubject.next(user);
    this.isAuthenticated.set(true);
    // Store user data in localStorage (not tokens - they're in httpOnly cookies)
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Clear authentication data from memory and localStorage
   */
  private clearAuthData(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('user');
  }

  /**
   * Get current user data
   */
  getCurrentUserData(): UserData | null {
    return this.currentUserSubject.value;
  }
}