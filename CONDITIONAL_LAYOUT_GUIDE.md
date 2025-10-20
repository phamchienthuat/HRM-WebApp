# Conditional Layout Implementation

## 🎯 Overview

The application now supports conditional layout rendering, allowing certain pages (like login) to be displayed without the main layout (sidebar, toolbar, etc.).

## 📋 How It Works

### 1. Route Configuration

In `app.routes.ts`, routes can specify whether they should use the main layout:

```typescript
export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/route').then(m => m.AUTH_ROUTES),
        data: { layout: false } // ← No layout for auth routes
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/route').then(m => m.DASHBOARD_ROUTES),
        data: { layout: true } // ← Use layout
    }
];
```

### 2. App Component Logic

The `App` component listens to route changes and updates the `showLayout` signal:

```typescript
export class App {
  protected readonly showLayout = signal(true);

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // Updates layout visibility on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLayoutState();
    });
  }

  private updateLayoutState(): void {
    // Checks route data or URL to determine layout visibility
  }
}
```

### 3. Template Conditional Rendering

The `app.html` template conditionally renders the layout:

```html
@if (showLayout()) {
  <app-layout></app-layout>
} @else {
  <router-outlet></router-outlet>
}
```

## 🔧 Implementation Details

### Routes Without Layout

These routes will display without the sidebar and toolbar:
- ✅ `/auth/login` - Login page
- ✅ `/auth/*` - All auth-related pages
- ✅ `/404` - Not found page

### Routes With Layout

These routes will display with the full layout:
- ✅ `/dashboard` - Dashboard
- ✅ `/employees` - Employee management
- ✅ All other feature routes

## 📝 Adding New Routes

### Route WITHOUT Layout

```typescript
{
    path: 'public-page',
    component: PublicPageComponent,
    data: { layout: false } // No sidebar/toolbar
}
```

### Route WITH Layout

```typescript
{
    path: 'protected-page',
    component: ProtectedPageComponent,
    data: { layout: true } // Show sidebar/toolbar
}
```

Or simply omit the `data` property (defaults to showing layout if URL doesn't contain '/auth'):

```typescript
{
    path: 'protected-page',
    component: ProtectedPageComponent
    // Will show layout by default
}
```

## 🎨 Layout Structure

### With Layout (`showLayout = true`)
```
┌─────────────────────────────────────┐
│  Sidebar  │  Toolbar               │
│           ├────────────────────────┤
│  Menu     │  Content               │
│  Items    │  (router-outlet)       │
│           │                        │
└─────────────────────────────────────┘
```

### Without Layout (`showLayout = false`)
```
┌─────────────────────────────────────┐
│                                     │
│         Full Width Content          │
│         (router-outlet)             │
│                                     │
└─────────────────────────────────────┘
```

## 🔍 Decision Logic

The app determines whether to show the layout using this priority:

1. **Route Data**: If `data: { layout: false }` → Hide layout
2. **URL Check**: If URL contains `/auth` → Hide layout
3. **Default**: Show layout

## 💡 Use Cases

### Pages That Should NOT Have Layout
- Login/Register pages
- Password reset pages
- Email verification pages
- Public landing pages
- Error pages (404, 500, etc.)
- Print views
- Embedded widgets

### Pages That SHOULD Have Layout
- Dashboard
- CRUD operations (Create, Read, Update, Delete)
- User management
- Reports and analytics
- Settings
- Profile pages

## 🛠️ Customization

### Option 1: Add More Layout Variants

You can extend this to support multiple layout types:

```typescript
// In app.routes.ts
data: { layoutType: 'full' | 'minimal' | 'none' }

// In app.ts
@if (layoutType() === 'full') {
  <app-layout></app-layout>
} @else if (layoutType() === 'minimal') {
  <app-minimal-layout></app-minimal-layout>
} @else {
  <router-outlet></router-outlet>
}
```

### Option 2: Layout Based on Auth State

```typescript
private updateLayoutState(): void {
  const isAuthenticated = this.authService.isAuthenticated();
  const isAuthRoute = this.router.url.includes('/auth');
  
  // Show layout only if authenticated and not on auth route
  this.showLayout.set(isAuthenticated && !isAuthRoute);
}
```

## ✅ Testing

### Test Login Page (No Layout)
1. Navigate to: `http://localhost:4200/auth/login`
2. Expected: Full-width login form, no sidebar, no toolbar

### Test Dashboard (With Layout)
1. Navigate to: `http://localhost:4200/dashboard`
2. Expected: Sidebar on left, toolbar on top, content area

### Test Route Transition
1. Start at: `/auth/login` (no layout)
2. Login successfully → redirects to `/dashboard` (layout appears)
3. Logout → redirects to `/auth/login` (layout disappears)

## 🐛 Troubleshooting

### Issue: Layout shows on login page
**Solution**: Check that route data has `layout: false` and URL includes '/auth'

### Issue: Layout doesn't appear on dashboard
**Solution**: Verify route data is not set to `layout: false`

### Issue: Layout flickers during route changes
**Solution**: The signal-based approach should prevent this, but you can add CSS transitions

## 📚 Related Files

- `src/app/app.ts` - Main app component with layout logic
- `src/app/app.html` - Template with conditional rendering
- `src/app/app.routes.ts` - Route configuration with layout data
- `src/app/layout/layout.ts` - Main layout component
- `src/app/features/auth/pages/login/` - Login page (no layout)

---

**Note**: This implementation uses Angular 18+ features including signals and the new control flow syntax (`@if`, `@else`).
