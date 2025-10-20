import { Routes } from '@angular/router';
import { NotFound } from './shared/pages/not-found/not-found';


export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/route').then(m => m.AUTH_ROUTES),
        data: { layout: false } // No layout for auth routes
    },
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./features/dashboard/route').then(m => m.DASHBOARD_ROUTES),
        data: { layout: true } // Use layout
    },
    {
        path: 'employees',
        loadChildren: () =>
            import('./features/employee/route').then(m => m.EMPLOYEE_ROUTES),
        data: { layout: true } // Use layout
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
