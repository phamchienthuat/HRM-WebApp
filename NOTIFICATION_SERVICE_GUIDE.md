# Notification Service Quick Reference

The `NotificationService` provides standardized toast notifications using `ngx-toastr`.

## Installation & Setup

Already configured in your app! The service is ready to use.

## Basic Usage

```typescript
import { NotificationService } from '../shared/services/notification.service';

constructor(private notification: NotificationService) {}
```

## Available Methods

### Basic Notifications

```typescript
// Success notification
this.notification.success('Operation completed successfully!');
this.notification.success('Data saved', 'Success');

// Error/Danger notifications
this.notification.error('Something went wrong!');
this.notification.danger('Critical error occurred', 'Danger');

// Warning notification
this.notification.warning('Please check your input');

// Info notification
this.notification.info('New feature available', 'Information');
```

### HTTP-Related Notifications

```typescript
// Handle HTTP errors automatically
this.notification.httpError(error);
this.notification.httpError(error, 'Custom error message');

// Common CRUD operations
this.notification.saved('Employee');        // "Employee saved successfully"
this.notification.created('User');          // "User created successfully"
this.notification.updated('Profile');       // "Profile updated successfully"
this.notification.deleted('Document');      // "Document deleted successfully"
```

### Advanced Notifications

```typescript
// Loading notification (returns ID for later removal)
const loadingId = this.notification.loading('Processing...', 'Please wait');
// Later: this.notification.remove(loadingId);

// Confirmation-style notification (no auto-hide)
this.notification.confirm('Are you sure you want to delete this item?');

// Custom configuration
this.notification.success('Message', 'Title', {
  timeOut: 10000,
  closeButton: true,
  progressBar: false,
  positionClass: 'toast-top-center'
});

// Generic show method
this.notification.show('success', 'Message', 'Title', config);
```

### Utility Methods

```typescript
// Clear all notifications
this.notification.clear();

// Remove specific notification
this.notification.remove(toastId);
```

## Configuration Options

Available in `NotificationConfig` interface:

- `timeOut`: Auto-hide timeout in milliseconds (0 = no auto-hide)
- `closeButton`: Show close button
- `progressBar`: Show progress bar
- `positionClass`: Position ('toast-top-right', 'toast-top-center', etc.)
- `enableHtml`: Allow HTML in messages

## Example in Component

```typescript
import { Component } from '@angular/core';
import { NotificationService } from '../shared/services/notification.service';

@Component({
  // component config
})
export class MyComponent {
  constructor(private notification: NotificationService) {}

  saveData() {
    const loadingId = this.notification.loading('Saving data...');
    
    this.dataService.save(this.data).subscribe({
      next: () => {
        this.notification.remove(loadingId);
        this.notification.saved('Data');
      },
      error: (error) => {
        this.notification.remove(loadingId);
        this.notification.httpError(error);
      }
    });
  }
}
```

## Testing

Click the "Test Notifications" button in the toolbar to see all notification types in action.

## Global Configuration

Configured in `app.config.ts` with these defaults:
- Position: top-right
- Timeout: 5 seconds
- Progress bar: enabled
- Close button: enabled
- Prevent duplicates: enabled