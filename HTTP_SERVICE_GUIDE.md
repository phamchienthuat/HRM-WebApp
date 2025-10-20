# HTTP Service - Best Practices Guide

## 📁 Project Structure

```
src/app/
├── core/
│   ├── services/
│   │   ├── http.service.ts           # Base HTTP service
│   │   └── base-http.service.ts      # Alternative implementation
│   ├── interceptors/
│   │   ├── auth.interceptor.ts       # Adds auth token to requests
│   │   ├── error.interceptor.ts      # Global error handling
│   │   └── logging.interceptor.ts    # Request/response logging
│   ├── models/
│   │   ├── api-response.model.ts     # API response interfaces
│   │   └── http-options.model.ts     # HTTP options interfaces
│   └── index.ts                       # Barrel exports
├── features/
│   └── employee/
│       └── services/
│           └── employee.service.ts    # Feature-specific service
└── environments/
    ├── environment.ts                 # Production config
    └── environment.development.ts     # Development config
```

## 🚀 Getting Started

### 1. Configuration Already Done ✅

The HTTP client and interceptors are already configured in `app.config.ts`:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        loggingInterceptor,  // Logs requests (dev only)
        authInterceptor,     // Adds JWT token
        errorInterceptor     // Handles errors globally
      ])
    )
  ]
};
```

### 2. Environment Configuration

Update your API URL in `src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',  // Your backend URL
  apiVersion: 'v1',
  apiTimeout: 30000,
  enableLogging: true,
  enableApiCache: false,
};
```

## 📖 Usage Examples

### Basic Usage - Using BaseHttpService

#### Example 1: Simple GET Request

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../../../core/services/http.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: BaseHttpService) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/users');
  }
}
```

#### Example 2: GET with Query Parameters

```typescript
getUsers(page: number, pageSize: number): Observable<User[]> {
  return this.http.get<User[]>('/users', {
    params: {
      page: page,
      pageSize: pageSize,
      sortBy: 'name'
    }
  });
}
```

#### Example 3: POST Request

```typescript
createUser(user: CreateUserDto): Observable<ApiResponse<User>> {
  return this.http.postWithResponse<User>('/users', user);
}
```

#### Example 4: PUT Request

```typescript
updateUser(id: string, user: UpdateUserDto): Observable<ApiResponse<User>> {
  return this.http.putWithResponse<User>(`/users/${id}`, user);
}
```

#### Example 5: DELETE Request

```typescript
deleteUser(id: string): Observable<ApiResponse<void>> {
  return this.http.deleteWithResponse<void>(`/users/${id}`);
}
```

#### Example 6: Paginated Data

```typescript
getEmployees(params: PaginationParams): Observable<PaginatedResponse<Employee>> {
  return this.http.getPaginated<Employee>('/employees', params);
}
```

#### Example 7: File Upload

```typescript
uploadAvatar(userId: string, file: File): Observable<any> {
  const formData = new FormData();
  formData.append('avatar', file);
  
  return this.http.upload(`/users/${userId}/avatar`, formData);
}
```

#### Example 8: File Download

```typescript
downloadReport(): Observable<Blob> {
  return this.http.download('/reports/monthly', 'monthly-report.pdf');
}
```

#### Example 9: Cached Request (for static/reference data)

```typescript
getDepartments(): Observable<Department[]> {
  // This will cache the result and reuse it
  return this.http.getCached<Department[]>('/departments');
}
```

### Component Usage

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { EmployeeService } from './services/employee.service';

@Component({
  selector: 'app-employee-list',
  template: `
    <div *ngFor="let employee of employees()">
      {{ employee.firstName }} {{ employee.lastName }}
    </div>
  `
})
export class EmployeeListComponent implements OnInit {
  employees = signal<Employee[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.isLoading.set(true);
    this.error.set(null);

    this.employeeService.getAll({ page: 1, pageSize: 10 }).subscribe({
      next: (response) => {
        this.employees.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  createEmployee(data: CreateEmployeeDto) {
    this.employeeService.create(data).subscribe({
      next: (response) => {
        console.log('Employee created:', response.data);
        this.loadEmployees(); // Reload list
      },
      error: (error) => {
        console.error('Failed to create employee:', error.message);
      }
    });
  }
}
```

## 🔐 Authentication

The `authInterceptor` automatically adds the JWT token to all requests (except login/register):

```typescript
// The token is automatically added from localStorage
// Key: 'hrm_auth_token'

// To set the token after login:
localStorage.setItem('hrm_auth_token', response.token);

// To remove token on logout:
localStorage.removeItem('hrm_auth_token');
```

## 🎯 Error Handling

### Global Error Handling

The `errorInterceptor` handles common errors:
- **401 Unauthorized**: Automatically redirects to login
- **403 Forbidden**: Logs access denied
- **0 Network Error**: Logs network issues

### Custom Error Handling

```typescript
this.employeeService.getById('123').subscribe({
  next: (response) => {
    console.log(response.data);
  },
  error: (error) => {
    // error has: message, status, statusText, error
    if (error.status === 404) {
      console.error('Employee not found');
    } else {
      console.error('Error:', error.message);
    }
  }
});
```

## 📝 Creating a New Feature Service

### Step 1: Define Your Models

```typescript
// features/department/models/department.model.ts
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  createdAt: string;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
  managerId?: string;
}
```

### Step 2: Create the Service

```typescript
// features/department/services/department.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../../../core/services/http.service';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import { Department, CreateDepartmentDto } from '../models/department.model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private readonly endpoint = 'departments';

  constructor(private http: BaseHttpService) {}

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.endpoint);
  }

  getById(id: string): Observable<ApiResponse<Department>> {
    return this.http.getWithResponse<Department>(`${this.endpoint}/${id}`);
  }

  create(dept: CreateDepartmentDto): Observable<ApiResponse<Department>> {
    return this.http.postWithResponse<Department>(this.endpoint, dept);
  }

  update(id: string, dept: Partial<Department>): Observable<ApiResponse<Department>> {
    return this.http.putWithResponse<Department>(`${this.endpoint}/${id}`, dept);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.deleteWithResponse<void>(`${this.endpoint}/${id}`);
  }
}
```

## 🔧 Advanced Features

### Custom Headers

```typescript
this.http.get<User[]>('/users', {
  headers: {
    'X-Custom-Header': 'value',
    'Accept-Language': 'en-US'
  }
});
```

### Custom Timeout

The default timeout is 30 seconds (configured in environment).
To handle specific cases, wrap with your own timeout:

```typescript
import { timeout } from 'rxjs/operators';

this.http.get<Data>('/slow-endpoint').pipe(
  timeout(60000) // 60 seconds
).subscribe(...);
```

### Retry Logic

The service automatically retries failed requests 2 times for GET requests.
For custom retry logic:

```typescript
import { retry } from 'rxjs/operators';

this.http.post('/data', body).pipe(
  retry(3) // Retry 3 times
).subscribe(...);
```

## 🎨 Response Types

### Standard Response

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}
```

### Paginated Response

```typescript
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
  message?: string;
}
```

## 📊 Best Practices

### ✅ DO:
- Use `BaseHttpService` for all HTTP operations
- Define clear TypeScript interfaces for your data
- Handle errors in components
- Use signals for reactive state management
- Cache static/reference data with `getCached()`
- Use pagination for large datasets
- Keep services focused on a single feature

### ❌ DON'T:
- Don't use `HttpClient` directly in components
- Don't duplicate HTTP logic across services
- Don't forget to unsubscribe (use `async` pipe or `takeUntil`)
- Don't hardcode API URLs (use environment config)
- Don't handle auth tokens manually (interceptor does it)

## 🐛 Troubleshooting

### Issue: "No provider for HttpClient"
**Solution**: Make sure `provideHttpClient()` is in `app.config.ts`

### Issue: "401 Unauthorized"
**Solution**: Check that token is stored in localStorage with key `'hrm_auth_token'`

### Issue: "CORS Error"
**Solution**: Configure CORS in your NestJS backend

### Issue: "Timeout Error"
**Solution**: Increase timeout in environment config or handle slow endpoints separately

## 📚 Additional Resources

- [Angular HttpClient Guide](https://angular.dev/guide/http)
- [RxJS Operators](https://rxjs.dev/guide/operators)
- [Angular Interceptors](https://angular.dev/guide/http-interceptor-use-cases)

---

**Note**: This HTTP service structure is production-ready and follows Angular best practices for 2025.
