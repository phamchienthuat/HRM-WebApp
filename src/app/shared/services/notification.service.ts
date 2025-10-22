import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

export interface NotificationConfig {
  title?: string;
  message?: string;
  timeOut?: number;
  closeButton?: boolean;
  progressBar?: boolean;
  positionClass?: string;
  enableHtml?: boolean;
}

/**
 * Notification Service
 * Provides standardized notification methods using ngx-toastr
 * 
 * @example
 * ```typescript
 * constructor(private notification: NotificationService) {}
 * 
 * this.notification.success('Operation completed successfully!');
 * this.notification.error('Something went wrong', 'Error');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  constructor(private toastr: ToastrService) {}

  /**
   * Show success notification
   * @param message Success message
   * @param title Optional title (default: 'Success')
   * @param config Optional configuration
   */
  success(message: string, title?: string, config?: NotificationConfig) {
    const options = this.buildConfig(config);
    this.toastr.success(message, title || 'Success', options);
  }

  /**
   * Show error/danger notification
   * @param message Error message
   * @param title Optional title (default: 'Error')
   * @param config Optional configuration
   */
  error(message: string, title?: string, config?: NotificationConfig) {
    const options = this.buildConfig({
      timeOut: 0, // Don't auto-hide errors by default
      closeButton: true,
      ...config
    });
    this.toastr.error(message, title || 'Error', options);
  }

  /**
   * Show danger notification (alias for error)
   * @param message Danger message
   * @param title Optional title (default: 'Danger')
   * @param config Optional configuration
   */
  danger(message: string, title?: string, config?: NotificationConfig) {
    this.error(message, title || 'Danger', config);
  }

  /**
   * Show warning notification
   * @param message Warning message
   * @param title Optional title (default: 'Warning')
   * @param config Optional configuration
   */
  warning(message: string, title?: string, config?: NotificationConfig) {
    const options = this.buildConfig({
      timeOut: 8000, // Longer timeout for warnings
      ...config
    });
    this.toastr.warning(message, title || 'Warning', options);
  }

  /**
   * Show info notification
   * @param message Info message
   * @param title Optional title (default: 'Info')
   * @param config Optional configuration
   */
  info(message: string, title?: string, config?: NotificationConfig) {
    const options = this.buildConfig(config);
    this.toastr.info(message, title || 'Info', options);
  }

  /**
   * Show custom notification
   * @param type Notification type ('success' | 'error' | 'warning' | 'info')
   * @param message Message
   * @param title Optional title
   * @param config Optional configuration
   */
  show(
    type: 'success' | 'error' | 'warning' | 'info', 
    message: string, 
    title?: string, 
    config?: NotificationConfig
  ) {
    const options = this.buildConfig(config);
    
    switch (type) {
      case 'success':
        this.toastr.success(message, title, options);
        break;
      case 'error':
        this.toastr.error(message, title, options);
        break;
      case 'warning':
        this.toastr.warning(message, title, options);
        break;
      case 'info':
        this.toastr.info(message, title, options);
        break;
    }
  }

  /**
   * Clear all notifications
   */
  clear() {
    this.toastr.clear();
  }

  /**
   * Clear specific notification by id
   * @param toastId Toast ID to remove
   */
  remove(toastId: number) {
    this.toastr.remove(toastId);
  }

  /**
   * Show loading notification (info with no timeout)
   * @param message Loading message
   * @param title Optional title (default: 'Loading')
   * @returns Toast ID for later removal
   */
  loading(message: string, title?: string): number {
    const toast = this.toastr.info(message, title || 'Loading', {
      timeOut: 0,
      closeButton: false,
      progressBar: true,
      positionClass: 'toast-top-center'
    });
    return toast.toastId;
  }

  /**
   * Show confirmation-style notification (warning with no timeout and close button)
   * @param message Confirmation message
   * @param title Optional title (default: 'Confirm')
   * @param config Optional configuration
   */
  confirm(message: string, title?: string, config?: NotificationConfig) {
    const options = this.buildConfig({
      timeOut: 0,
      closeButton: true,
      progressBar: false,
      ...config
    });
    this.toastr.warning(message, title || 'Confirm', options);
  }

  /**
   * Convenient methods for common HTTP scenarios
   */
  httpError(error: any, customMessage?: string) {
    let message = customMessage || 'An error occurred';
    
    if (error?.message) {
      message = error.message;
    } else if (error?.error?.message) {
      message = error.error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    
    this.error(message, 'Request Failed');
  }

  /**
   * Show success for saved operations
   */
  saved(itemName?: string) {
    const message = itemName ? `${itemName} saved successfully` : 'Changes saved successfully';
    this.success(message, 'Saved');
  }

  /**
   * Show success for deleted operations
   */
  deleted(itemName?: string) {
    const message = itemName ? `${itemName} deleted successfully` : 'Item deleted successfully';
    this.success(message, 'Deleted');
  }

  /**
   * Show success for created operations
   */
  created(itemName?: string) {
    const message = itemName ? `${itemName} created successfully` : 'Item created successfully';
    this.success(message, 'Created');
  }

  /**
   * Show success for updated operations
   */
  updated(itemName?: string) {
    const message = itemName ? `${itemName} updated successfully` : 'Item updated successfully';
    this.success(message, 'Updated');
  }

  /**
   * Build toastr configuration from NotificationConfig
   */
  private buildConfig(config?: NotificationConfig): Partial<IndividualConfig> {
    if (!config) return {};

    return {
      timeOut: config.timeOut,
      closeButton: config.closeButton,
      progressBar: config.progressBar,
      positionClass: config.positionClass,
      enableHtml: config.enableHtml
    };
  }
}