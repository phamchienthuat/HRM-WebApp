import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, map, timeout, retry, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PaginatedResponse, QueryParams } from '../models/api-response.model';
import { HttpRequestOptions } from '../models/http-options.model';

/**
 * Base HTTP Service
 * Provides generic HTTP operations with error handling, retry logic, and timeout
 * 
 * @example
 * ```typescript
 * constructor(private http: BaseHttpService) {}
 * 
 * this.http.get<User[]>('/users').subscribe(users => {
 *   console.log(users);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;
  private readonly maxRetries: number = 2;

  constructor(private http: HttpClient) {
    // Configure based on environment
    if (environment.production) {
      // Production configuration
      this.baseUrl = environment.apiUrl;
      this.defaultTimeout = environment.apiTimeout || 30000; // Default 30 seconds for production
    } else {
      // Development configuration
      this.baseUrl = environment.apiUrl;
      this.defaultTimeout = environment.apiTimeout || 10000; // Default 10 seconds for development
    }
  }

  /**
   * GET request
   * @param endpoint API endpoint (e.g., '/users')
   * @param options Request options
   */
  get<T>(endpoint: string, options?: HttpRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return (this.http.get<T>(url, httpOptions) as Observable<T>).pipe(
      timeout(this.defaultTimeout),
      retry(this.maxRetries),
      catchError(this.handleError)
    );
  }

  /**
   * GET request with API Response wrapper
   */
  getWithResponse<T>(endpoint: string, options?: HttpRequestOptions): Observable<ApiResponse<T>> {
    return this.get<ApiResponse<T>>(endpoint, options).pipe(
      map(response => this.validateResponse(response))
    );
  }

  /**
   * GET request for paginated data
   */
  getPaginated<T>(
    endpoint: string, 
    params?: QueryParams, 
    options?: HttpRequestOptions
  ): Observable<PaginatedResponse<T>> {
    const mergedParams = { ...params, ...(options?.params || {}) };
    const mergedOptions: HttpRequestOptions = {
      ...options,
      params: mergedParams as any
    };

    return this.get<PaginatedResponse<T>>(endpoint, mergedOptions).pipe(
      map(response => this.validateResponse(response))
    );
  }

  /**
   * POST request
   * @param endpoint API endpoint
   * @param body Request body
   * @param options Request options
   */
  post<T>(endpoint: string, body: any, options?: HttpRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return (this.http.post<T>(url, body, httpOptions) as Observable<T>).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * POST request with API Response wrapper
   */
  postWithResponse<T>(
    endpoint: string, 
    body: any, 
    options?: HttpRequestOptions
  ): Observable<ApiResponse<T>> {
    return this.post<ApiResponse<T>>(endpoint, body, options).pipe(
      map(response => this.validateResponse(response))
    );
  }

  /**
   * PUT request
   * @param endpoint API endpoint
   * @param body Request body
   * @param options Request options
   */
  put<T>(endpoint: string, body: any, options?: HttpRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return (this.http.put<T>(url, body, httpOptions) as Observable<T>).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * PUT request with API Response wrapper
   */
  putWithResponse<T>(
    endpoint: string, 
    body: any, 
    options?: HttpRequestOptions
  ): Observable<ApiResponse<T>> {
    return this.put<ApiResponse<T>>(endpoint, body, options).pipe(
      map(response => this.validateResponse(response))
    );
  }

  /**
   * PATCH request
   * @param endpoint API endpoint
   * @param body Request body
   * @param options Request options
   */
  patch<T>(endpoint: string, body: any, options?: HttpRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return (this.http.patch<T>(url, body, httpOptions) as Observable<T>).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * DELETE request
   * @param endpoint API endpoint
   * @param options Request options
   */
  delete<T>(endpoint: string, options?: HttpRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return (this.http.delete<T>(url, httpOptions) as Observable<T>).pipe(
      timeout(this.defaultTimeout),
      catchError(this.handleError)
    );
  }

  /**
   * DELETE request with API Response wrapper
   */
  deleteWithResponse<T>(endpoint: string, options?: HttpRequestOptions): Observable<ApiResponse<T>> {
    return this.delete<ApiResponse<T>>(endpoint, options).pipe(
      map(response => this.validateResponse(response))
    );
  }

  /**
   * Upload file(s)
   * @param endpoint API endpoint
   * @param formData FormData containing file(s)
   * @param options Request options
   */
  upload<T>(endpoint: string, formData: FormData, options?: HttpRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return (this.http.post<T>(url, formData, httpOptions) as Observable<T>).pipe(
      timeout(this.defaultTimeout * 2), // Longer timeout for uploads
      catchError(this.handleError)
    );
  }

  /**
   * Download file
   * @param endpoint API endpoint
   * @param filename Optional filename for download
   */
  download(endpoint: string, filename?: string): Observable<Blob> {
    const url = this.buildUrl(endpoint);

    return this.http.get(url, { 
      responseType: 'blob',
      observe: 'response'
    }).pipe(
      timeout(this.defaultTimeout * 2),
      map(response => {
        if (filename) {
          this.saveFile(response.body!, filename);
        }
        return response.body!;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Cache GET request (useful for reference data)
   */
  getCached<T>(endpoint: string, options?: HttpRequestOptions): Observable<T> {
    const url = this.buildUrl(endpoint);
    const httpOptions = this.buildHttpOptions(options);

    return (this.http.get<T>(url, httpOptions) as Observable<T>).pipe(
      timeout(this.defaultTimeout),
      retry(this.maxRetries),
      shareReplay(1), // Cache the result
      catchError(this.handleError)
    );
  }

  /**
   * Build full URL from endpoint
   */
  private buildUrl(endpoint: string): string {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  /**
   * Build HTTP options (headers, params, etc.)
   */
  private buildHttpOptions(options?: HttpRequestOptions): any {
    const httpOptions: any = {};

    // Set headers
    if (options?.headers) {
      httpOptions.headers = new HttpHeaders(options.headers);
    }

    // Set query parameters
    if (options?.params) {
      httpOptions.params = this.buildHttpParams(options.params);
    }

    // Set other options
    if (options?.responseType) {
      httpOptions.responseType = options.responseType;
    }

    if (options?.withCredentials) {
      httpOptions.withCredentials = options.withCredentials;
    }

    return httpOptions;
  }

  /**
   * Build HttpParams from object
   */
  private buildHttpParams(params: { [key: string]: any }): HttpParams {
    let httpParams = new HttpParams();

    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => {
            httpParams = httpParams.append(key, String(item));
          });
        } else {
          httpParams = httpParams.set(key, String(value));
        }
      }
    });

    return httpParams;
  }

  /**
   * Validate API response
   */
  private validateResponse<T>(response: ApiResponse<T> | PaginatedResponse<T>): any {
    if (!response.success) {
      throw new Error(response.message || 'API request failed');
    }
    return response;
  }

  /**
   * Save downloaded file
   */
  private saveFile(blob: Blob, filename: string): void {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else if (error instanceof TimeoutError) {
      // Timeout error
      errorMessage = 'Request timeout. Please try again.';
    } else {
      // Server-side error
      errorMessage = this.getServerErrorMessage(error);
    }

    // Log errors based on environment
    if (environment.production) {
      // In production, log minimal error information
      if (environment.enableLogging) {
        console.error('HTTP Error:', errorMessage);
      }
    } else {
      // In development, log detailed error information
      console.error('HTTP Error:', errorMessage, error);
    }

    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      statusText: error.statusText,
      error: error.error
    }));
  };

  /**
   * Extract error message from server response
   */
  private getServerErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.message) {
      return error.error.message;
    }

    switch (error.status) {
      case 400:
        return 'Bad Request: Please check your input.';
      case 401:
        return 'Unauthorized: Please login again.';
      case 403:
        return 'Forbidden: You do not have permission to access this resource.';
      case 404:
        return 'Not Found: The requested resource does not exist.';
      case 500:
        return 'Internal Server Error: Please try again later.';
      case 503:
        return 'Service Unavailable: The server is temporarily unavailable.';
      default:
        return `Server Error: ${error.statusText || 'Unknown error occurred'}`;
    }
  }
}
