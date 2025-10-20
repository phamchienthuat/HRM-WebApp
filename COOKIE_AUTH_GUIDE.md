# Cookie-Based Authentication Guide

This guide explains how the Angular frontend works with the NestJS backend's cookie-based authentication.

## 🔐 Authentication Flow

### Backend (NestJS)
The backend stores JWT tokens in **httpOnly cookies** for security:
- **Access Token**: 15 minutes expiry (in `access_token` cookie)
- **Refresh Token**: 7 days expiry (in `refresh_token` cookie)
- Cookies are `httpOnly`, `secure` (in production), and `sameSite: strict`

### Frontend (Angular)
The frontend works with cookies automatically:
- No token storage in localStorage (more secure!)
- Cookies are sent automatically with every request
- Token refresh happens automatically on 401 errors

## 📁 Updated Files

### 1. **AuthService** (`auth.service.ts`)
```typescript
// Key changes:
- Removed localStorage token management
- Added withCredentials: true to all requests
- Login returns user data only (token in cookie)
- Added refreshTokens() method
- Added getCurrentUser() method for /auth/me endpoint
- Logout calls backend to clear cookies
```

### 2. **Auth Interceptor** (`auth.interceptor.ts`)
```typescript
// Simplified to just add withCredentials to all requests
- No more manual Bearer token headers
- Cookies sent automatically
```

### 3. **Error Interceptor** (`error.interceptor.ts`)
```typescript
// Added automatic token refresh on 401 errors
- Calls /auth/refresh when access token expires
- Retries failed request after refresh
- Prevents multiple simultaneous refresh calls
- Redirects to login if refresh fails
```

## 🔄 How Token Refresh Works

1. **Access token expires** → API returns 401
2. **Error interceptor catches 401** → Calls `/auth/refresh`
3. **Backend sends new cookies** → Access token refreshed
4. **Original request retried** → Succeeds with new token
5. **If refresh fails** → User redirected to login

## 🚀 API Endpoints Used

### Login
```http
POST /api/auth/login
Body: { email, password }
Response: { success, message, data: { user } }
Sets: access_token, refresh_token cookies
```

### Logout
```http
POST /api/auth/logout
Response: { success, message }
Clears: access_token, refresh_token cookies
```

### Refresh
```http
POST /api/auth/refresh
Response: { success, message }
Updates: access_token, refresh_token cookies
```

### Get Current User
```http
GET /api/auth/me
Response: { success, data: { user } }
```

## 🧪 Testing

### Test Login
1. Navigate to `http://localhost:4200/auth/login`
2. Enter credentials:
   - Email: `user@example.com`
   - Password: `YourPassword123`
3. Click "Sign In"
4. Check browser DevTools → Application → Cookies
5. You should see `access_token` and `refresh_token` cookies

### Test Protected Routes
1. After login, navigate to `/dashboard`
2. Check Network tab - requests include cookies
3. Manually delete `access_token` cookie
4. Make another request
5. Should auto-refresh and work

### Test Logout
1. Click logout button
2. Check DevTools → Cookies should be cleared
3. Try accessing `/dashboard` → Should redirect to login

## 🔒 Security Benefits

### Why httpOnly Cookies?
✅ **XSS Protection**: JavaScript cannot read httpOnly cookies  
✅ **CSRF Protection**: SameSite=strict prevents cross-site requests  
✅ **No localStorage**: Tokens never exposed to JavaScript  
✅ **Automatic**: Browser handles cookie management  

### Traditional Token Approach (OLD)
❌ Token in localStorage → Vulnerable to XSS  
❌ Manual header management → Error-prone  
❌ Token exposed to all JavaScript → Security risk  

## 🛠️ Important Configuration

### CORS Configuration (Backend)
Your NestJS backend needs proper CORS:
```typescript
app.enableCors({
  origin: 'http://localhost:4200', // Frontend URL
  credentials: true, // Important for cookies!
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### withCredentials (Frontend)
All HTTP requests must include `withCredentials: true`:
```typescript
// Handled automatically by authInterceptor
http.get('/api/data', { withCredentials: true })
```

## 📝 Usage in Components

### Login
```typescript
this.authService.login({ email, password }).subscribe({
  next: (response) => {
    // Cookies set automatically
    this.router.navigate(['/dashboard']);
  },
  error: (error) => {
    console.error('Login failed:', error);
  }
});
```

### Logout
```typescript
this.authService.logout().subscribe({
  next: () => {
    // Cookies cleared automatically
    // Redirected to login
  }
});
```

### Check Auth Status
```typescript
// In component
isAuthenticated = this.authService.isAuthenticated;

// In template
@if (isAuthenticated()) {
  <p>Logged in!</p>
}
```

### Get Current User
```typescript
currentUser$ = this.authService.currentUser$;

// In template
@if (currentUser$ | async; as user) {
  <p>Welcome, {{ user.username }}!</p>
}
```

## 🐛 Troubleshooting

### Cookies not being set?
- Check backend CORS configuration
- Ensure `credentials: true` in CORS
- Check `withCredentials: true` in requests
- Verify backend URL matches (localhost:4000)

### 401 errors not refreshing?
- Check error interceptor is registered
- Verify refresh endpoint returns new cookies
- Check browser console for interceptor logs

### Infinite redirect loop?
- Check that `/auth/login` and `/auth/refresh` skip guards
- Verify error interceptor doesn't refresh on these endpoints

## 📊 Interceptor Order

The interceptors are applied in this order (in `app.config.ts`):
```typescript
provideHttpClient(
  withInterceptors([
    loggingInterceptor,  // 1. Log request
    authInterceptor,     // 2. Add withCredentials
    errorInterceptor     // 3. Handle errors & refresh
  ])
)
```

## 🎯 Next Steps

1. ✅ Test login with real backend
2. ✅ Test token refresh (wait 15 min or manually delete cookie)
3. ✅ Implement auth guard for protected routes
4. ✅ Add loading states during refresh
5. ✅ Handle remember me functionality (extend refresh token)

---

**Created by**: Senior Angular Developer  
**Date**: October 17, 2025  
**Status**: Production Ready ✅
