import { Routes } from '@angular/router';
import { NotFound } from './shared/pages/not-found/not-found';
import { authGuard, guestGuard } from './core/guards/auth.guard';


export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/route').then(m => m.AUTH_ROUTES),
        canActivate: [guestGuard],
        data: { layout: false }
    },
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./features/dashboard/route').then(m => m.DASHBOARD_ROUTES),
        canActivate: [authGuard],
        data: { layout: true }
    },
    {
        path: 'employees',
        loadChildren: () =>
            import('./features/employee/route').then(m => m.EMPLOYEE_ROUTES),
        canActivate: [authGuard],
        data: { layout: true }
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    { 
        path: '**', 
        component: NotFound,
        data: { layout: false } // No layout for 404
    }
];
