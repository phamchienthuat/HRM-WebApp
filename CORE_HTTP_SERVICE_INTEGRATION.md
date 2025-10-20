# Core HTTP Service Integration

This document explains how the authentication service now uses the centralized `BaseHttpService` from the core folder.

## 🎯 Why Use BaseHttpService?

### Before (Direct HttpClient)
```typescript
constructor(private http: HttpClient) {}

this.http.post('http://localhost:4000/api/auth/login', data).subscribe(...)
```
❌ Hardcoded API URLs  
❌ No centralized error handling  
❌ Duplicate timeout/retry logic  
❌ No consistent API response structure  

### After (BaseHttpService)
```typescript
constructor(private http: BaseHttpService) {}

this.http.post('/api/auth/login', data).subscribe(...)
```
✅ Centralized configuration (environment-based)  
✅ Automatic error handling & retry  
✅ Consistent timeout management  
✅ Type-safe responses  
✅ Built-in logging (dev only)  

## 📁 Updated Files

### 1. **auth.service.ts**
```typescript
// Changed from:
import { HttpClient } from '@angular/common/http';
constructor(private http: HttpClient) {}

// To:
import { BaseHttpService } from '../../../core/services/http.service';
constructor(private http: BaseHttpService) {}
```

**Benefits:**
- All requests go through BaseHttpService
- Automatic baseUrl from environment config
- Built-in error handling and retry logic
- Consistent timeout management (30 seconds)
- Type-safe API responses

### 2. **error.interceptor.ts**
```typescript
// Added:
import { environment } from '../../../environments/environment';

// Changed from:
http.post('http://localhost:4000/api/auth/refresh', ...)

// To:
http.post(`${environment.apiUrl}/api/auth/refresh`, ...)
```

**Note:** Error interceptor still uses `HttpClient` directly (not BaseHttpService) because:
- Interceptors need direct HttpClient access to avoid circular dependencies
- Token refresh needs to bypass normal error handling
- This is the correct pattern for functional interceptors

## 🔧 Configuration

### Environment Files

**environment.development.ts**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000',  // ← Backend URL
  apiVersion: 'v1',
  apiTimeout: 30000,                 // 30 seconds
  enableLogging: true,
  enableApiCache: false,
};
```

**environment.ts** (production)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com',
  apiVersion: 'v1',
  apiTimeout: 30000,
  enableLogging: false,
  enableApiCache: true,
};
```

## 🚀 How It Works

### Request Flow
```
Component/Service
    ↓
AuthService (uses BaseHttpService)
    ↓
BaseHttpService (builds full URL from environment)
    ↓
Auth Interceptor (adds withCredentials: true)
    ↓
Logging Interceptor (logs in dev mode)
    ↓
HTTP Request → Backend
    ↓
Error Interceptor (handles 401, refreshes token)
    ↓
Response back to service
```

### Example: Login Request

**Service Code:**
```typescript
this.http.post<AuthResponse>('/api/auth/login', credentials, { 
  withCredentials: true 
})
```

**What Happens:**
1. BaseHttpService prepends `environment.apiUrl` → `http://localhost:4000/api/auth/login`
2. Auth interceptor adds `withCredentials: true` to all requests
3. Request sent with cookies
4. If 401 error → Error interceptor automatically calls refresh
5. Retry original request with new token

## 📝 API Endpoint Patterns

### Authentication Endpoints
```typescript
// ✅ Correct - Relative paths
this.http.post('/api/auth/login', credentials)
this.http.post('/api/auth/logout', {})
this.http.post('/api/auth/refresh', {})
this.http.get('/api/auth/me')

// ❌ Wrong - Don't hardcode full URLs
this.http.post('http://localhost:4000/api/auth/login', credentials)
```

### Other Feature Endpoints
```typescript
// Employees
this.http.get('/api/employees')
this.http.post('/api/employees', employeeData)

// Leave Management
this.http.get('/api/leaves')
this.http.put('/api/leaves/123', updateData)

// Always use relative paths!
```

## 🎁 BaseHttpService Features

### Available Methods
```typescript
// Basic CRUD
get<T>(endpoint, options?)
post<T>(endpoint, body, options?)
put<T>(endpoint, body, options?)
patch<T>(endpoint, body, options?)
delete<T>(endpoint, options?)

// With API Response wrapper
getWithResponse<T>(endpoint, options?)
postWithResponse<T>(endpoint, body, options?)

// Pagination
getPaginated<T>(endpoint, params?)

// File operations
upload<T>(endpoint, file, additionalData?)
download(endpoint, filename, options?)

// Caching
getCached<T>(endpoint, options?)
```

### Example Usage
```typescript
// Simple GET
this.http.get<User[]>('/api/users').subscribe(users => {
  console.log(users);
});

// POST with response wrapper
this.http.postWithResponse<User>('/api/users', userData)
  .subscribe(response => {
    console.log(response.data);    // User object
    console.log(response.message); // Success message
  });

// Pagination
this.http.getPaginated<Employee>('/api/employees', {
  page: 1,
  limit: 20,
  search: 'john'
}).subscribe(response => {
  console.log(response.data);        // Employee[]
  console.log(response.pagination);  // { total, page, limit }
});

// File upload
this.http.upload('/api/upload', file, { folder: 'avatars' })
  .subscribe(response => {
    console.log('Upload progress:', response.progress);
  });
```

## 🔒 Cookie Authentication Integration

BaseHttpService works seamlessly with cookie authentication:

```typescript
// All requests include withCredentials: true
this.http.post('/api/auth/login', credentials, { 
  withCredentials: true  // Cookies sent automatically
})

// After login, all subsequent requests include cookies
this.http.get('/api/employees')  // ← Cookies sent automatically!
```

## 🧪 Testing

### Test AuthService with BaseHttpService
```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { BaseHttpService } from '../../../core/services/http.service';

describe('AuthService', () => {
  let service: AuthService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, BaseHttpService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should login successfully', () => {
    // Test implementation
  });
});
```

## 🛠️ Troubleshooting

### Issue: API URL not working
**Solution:** Check `environment.development.ts` has correct `apiUrl`

### Issue: CORS errors
**Solution:** Backend needs CORS configured:
```typescript
app.enableCors({
  origin: 'http://localhost:4200',
  credentials: true,  // Important for cookies!
});
```

### Issue: Timeout errors
**Solution:** Adjust timeout in environment:
```typescript
apiTimeout: 60000  // 60 seconds for slow endpoints
```

## 📊 Architecture Benefits

### Separation of Concerns
```
Features (auth, employees, etc.)
    ↓ Use
Core Services (BaseHttpService)
    ↓ Use
HTTP Interceptors (auth, error, logging)
    ↓ Use
Angular HttpClient
    ↓
Backend API
```

### Maintainability
- ✅ Single place to change API URL
- ✅ Single place to add headers
- ✅ Single place for error handling
- ✅ Single place for logging
- ✅ Easy to mock in tests

### Type Safety
```typescript
interface Employee { id: number; name: string; }

// Type-safe request & response
this.http.get<Employee[]>('/api/employees')
  .subscribe(employees => {
    employees.forEach(emp => {
      console.log(emp.name);  // ✅ TypeScript knows 'name' exists
    });
  });
```

## 🎯 Next Steps

1. ✅ AuthService now uses BaseHttpService
2. ✅ Error interceptor uses environment config
3. 📝 **TODO:** Migrate other services to use BaseHttpService
4. 📝 **TODO:** Create EmployeeService using BaseHttpService pattern
5. 📝 **TODO:** Add auth guard using AuthService.isAuthenticated

---

**Created by**: Senior Angular Developer  
**Date**: October 17, 2025  
**Status**: Production Ready ✅
