import { Routes } from '@angular/router';
import { Layout } from './layout/layout';
import { NotFound } from './shared/pages/not-found/not-found';


export const routes: Routes = [
    {
        path: 'dashboard',
        loadChildren: () =>
            import('./features/dashboard/route').then(m => m.DASHBOARD_ROUTES)
    },
    {
        path: 'employees',
        loadChildren: () =>
            import('./features/employee/route').then(m => m.EMPLOYEE_ROUTES)
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    { path: '**', component: NotFound }
];
