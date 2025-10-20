# Quick Reference: BaseHttpService Usage

## 🚀 Quick Start

### Import in Your Service
```typescript
import { BaseHttpService } from '../../../core/services/http.service';

@Injectable({ providedIn: 'root' })
export class YourService {
  constructor(private http: BaseHttpService) {}
}
```

### Common Operations

#### GET Request
```typescript
// Simple GET
this.http.get<User[]>('/api/users').subscribe(users => {
  console.log(users);
});

// GET with params
this.http.get<User>('/api/users/123', {
  params: { include: 'profile' }
}).subscribe(user => {
  console.log(user);
});
```

#### POST Request
```typescript
// Create resource
this.http.post<User>('/api/users', {
  name: 'John',
  email: 'john@example.com'
}).subscribe(user => {
  console.log('Created:', user);
});

// With cookie authentication
this.http.post('/api/auth/login', credentials, {
  withCredentials: true
}).subscribe(response => {
  console.log('Logged in!');
});
```

#### PUT/PATCH Request
```typescript
// Full update (PUT)
this.http.put<User>('/api/users/123', userData).subscribe();

// Partial update (PATCH)
this.http.patch<User>('/api/users/123', { name: 'New Name' }).subscribe();
```

#### DELETE Request
```typescript
this.http.delete('/api/users/123').subscribe(() => {
  console.log('Deleted!');
});
```

#### Pagination
```typescript
this.http.getPaginated<Employee>('/api/employees', {
  page: 1,
  limit: 20,
  search: 'john',
  sortBy: 'name',
  sortOrder: 'asc'
}).subscribe(response => {
  console.log(response.data);        // Employee[]
  console.log(response.pagination);  // { total, page, limit, pages }
});
```

#### File Upload
```typescript
const file = event.target.files[0];
this.http.upload<{ url: string }>('/api/upload', file, {
  folder: 'avatars'
}).subscribe(response => {
  if (response.progress) {
    console.log('Progress:', response.progress);
  }
  if (response.data) {
    console.log('Uploaded URL:', response.data.url);
  }
});
```

#### File Download
```typescript
this.http.download('/api/export/employees', 'employees.xlsx').subscribe();
```

## 🎯 Real-World Examples

### Employee Service
```typescript
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: BaseHttpService) {}

  getEmployees(params?: QueryParams): Observable<PaginatedResponse<Employee>> {
    return this.http.getPaginated<Employee>('/api/employees', params);
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`/api/employees/${id}`);
  }

  createEmployee(data: CreateEmployeeDto): Observable<Employee> {
    return this.http.post<Employee>('/api/employees', data);
  }

  updateEmployee(id: number, data: UpdateEmployeeDto): Observable<Employee> {
    return this.http.put<Employee>(`/api/employees/${id}`, data);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete(`/api/employees/${id}`);
  }
}
```

### Leave Service
```typescript
@Injectable({ providedIn: 'root' })
export class LeaveService {
  constructor(private http: BaseHttpService) {}

  getMyLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>('/api/leaves/me');
  }

  requestLeave(data: LeaveRequest): Observable<Leave> {
    return this.http.post<Leave>('/api/leaves', data);
  }

  approveLeave(id: number): Observable<Leave> {
    return this.http.patch<Leave>(`/api/leaves/${id}/approve`, {});
  }

  rejectLeave(id: number, reason: string): Observable<Leave> {
    return this.http.patch<Leave>(`/api/leaves/${id}/reject`, { reason });
  }
}
```

### Department Service
```typescript
@Injectable({ providedIn: 'root' })
export class DepartmentService {
  constructor(private http: BaseHttpService) {}

  getDepartments(): Observable<Department[]> {
    // Use caching for rarely-changing data
    return this.http.getCached<Department[]>('/api/departments', {
      cacheDuration: 5 * 60 * 1000  // 5 minutes
    });
  }

  getDepartmentWithEmployees(id: number): Observable<Department> {
    return this.http.get<Department>(`/api/departments/${id}`, {
      params: { include: 'employees' }
    });
  }
}
```

## ⚙️ Configuration Options

### Request Options
```typescript
interface HttpRequestOptions {
  headers?: { [key: string]: string };
  params?: { [key: string]: any };
  withCredentials?: boolean;
  reportProgress?: boolean;
  responseType?: 'json' | 'blob' | 'text';
}
```

### Example with Options
```typescript
this.http.get<User[]>('/api/users', {
  headers: { 'X-Custom-Header': 'value' },
  params: { status: 'active', limit: '50' },
  withCredentials: true
}).subscribe();
```

## 🔒 Authentication Integration

### Login (Sets Cookies)
```typescript
login(credentials: LoginCredentials): Observable<AuthResponse> {
  return this.http.post<AuthResponse>('/api/auth/login', credentials, {
    withCredentials: true  // ← Important for cookies
  });
}
```

### Logout (Clears Cookies)
```typescript
logout(): Observable<void> {
  return this.http.post('/api/auth/logout', {}, {
    withCredentials: true
  });
}
```

### Protected Requests (Automatic)
```typescript
// Cookies automatically sent with every request
this.http.get<Employee[]>('/api/employees').subscribe();
// ↑ Auth interceptor adds withCredentials: true automatically
```

## 📊 Response Types

### Simple Response
```typescript
// Direct data
this.http.get<User[]>('/api/users').subscribe(users => {
  // users is User[]
});
```

### API Response Wrapper
```typescript
// Wrapped response
this.http.getWithResponse<User[]>('/api/users').subscribe(response => {
  console.log(response.success);  // boolean
  console.log(response.message);  // string
  console.log(response.data);     // User[]
});
```

### Paginated Response
```typescript
this.http.getPaginated<Employee>('/api/employees').subscribe(response => {
  console.log(response.data);        // Employee[]
  console.log(response.pagination);  // Pagination info
  console.log(response.pagination.total);   // Total items
  console.log(response.pagination.page);    // Current page
  console.log(response.pagination.pages);   // Total pages
});
```

## 🛠️ Error Handling

### Built-in Error Handling
```typescript
// Automatic retry (2 attempts)
// Automatic timeout (30 seconds)
// Automatic error logging (dev mode)

this.http.get<User[]>('/api/users').subscribe({
  next: (users) => console.log(users),
  error: (error) => {
    // Already logged by interceptor
    // Already retried 2 times
    // Show user-friendly message
    console.error('Failed to load users');
  }
});
```

### Custom Error Handling
```typescript
this.http.get<User[]>('/api/users').pipe(
  catchError(error => {
    if (error.status === 404) {
      return of([]);  // Return empty array
    }
    return throwError(() => error);
  })
).subscribe();
```

## 📝 Best Practices

### ✅ DO
```typescript
// Use relative paths
this.http.get('/api/users')

// Use type parameters
this.http.get<User[]>('/api/users')

// Use interfaces for request/response
interface CreateUserDto { name: string; email: string; }
this.http.post<User>('/api/users', createUserDto)

// Handle errors gracefully
.subscribe({
  next: (data) => this.handleSuccess(data),
  error: (error) => this.handleError(error)
})
```

### ❌ DON'T
```typescript
// Don't hardcode full URLs
this.http.get('http://localhost:4000/api/users')  // ❌

// Don't skip type parameters
this.http.get('/api/users')  // ❌ Missing <User[]>

// Don't ignore errors
.subscribe(data => console.log(data))  // ❌ No error handling
```

## 🎁 Bonus: Loading States

### Component Pattern
```typescript
export class EmployeeListComponent {
  employees = signal<Employee[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(private employeeService: EmployeeService) {}

  loadEmployees() {
    this.isLoading.set(true);
    this.error.set(null);

    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load employees');
        this.isLoading.set(false);
      }
    });
  }
}
```

### Template
```html
@if (isLoading()) {
  <p>Loading...</p>
} @else if (error()) {
  <p class="error">{{ error() }}</p>
} @else {
  <ul>
    @for (employee of employees(); track employee.id) {
      <li>{{ employee.name }}</li>
    }
  </ul>
}
```

---

**Quick Tip:** Always use relative paths starting with `/api/` - the BaseHttpService will automatically prepend the correct base URL from environment configuration!
