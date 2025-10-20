import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../../../core/services/http.service';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';

/**
 * Employee Model
 */
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  hireDate?: string;
  salary?: number;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create Employee DTO
 */
export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  hireDate?: string;
  salary?: number;
}

/**
 * Update Employee DTO
 */
export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  status?: 'active' | 'inactive';
}

/**
 * Employee Filter Parameters
 */
export interface EmployeeFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  status?: 'active' | 'inactive';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Employee Service
 * Example of a feature service using BaseHttpService
 * 
 * @example
 * ```typescript
 * constructor(private employeeService: EmployeeService) {}
 * 
 * this.employeeService.getAll().subscribe(employees => {
 *   console.log(employees);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly endpoint = 'employees';

  constructor(private http: BaseHttpService) {}

  /**
   * Get all employees (with pagination)
   */
  getAll(params?: EmployeeFilterParams): Observable<PaginatedResponse<Employee>> {
    return this.http.getPaginated<Employee>(this.endpoint, params as any);
  }

  /**
   * Get employee by ID
   */
  getById(id: string): Observable<ApiResponse<Employee>> {
    return this.http.getWithResponse<Employee>(`${this.endpoint}/${id}`);
  }

  /**
   * Create new employee
   */
  create(employee: CreateEmployeeDto): Observable<ApiResponse<Employee>> {
    return this.http.postWithResponse<Employee>(this.endpoint, employee);
  }

  /**
   * Update employee
   */
  update(id: string, employee: UpdateEmployeeDto): Observable<ApiResponse<Employee>> {
    return this.http.putWithResponse<Employee>(`${this.endpoint}/${id}`, employee);
  }

  /**
   * Delete employee
   */
  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.deleteWithResponse<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Get employee statistics
   */
  getStatistics(): Observable<any> {
    return this.http.getCached(`${this.endpoint}/statistics`);
  }

  /**
   * Export employees to CSV
   */
  exportToCSV(params?: EmployeeFilterParams): Observable<Blob> {
    return this.http.download(`${this.endpoint}/export`, 'employees.csv');
  }

  /**
   * Upload employee avatar
   */
  uploadAvatar(id: string, file: File): Observable<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return this.http.upload<ApiResponse<{ url: string }>>(
      `${this.endpoint}/${id}/avatar`,
      formData
    );
  }
}
