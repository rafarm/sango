import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
//import { DashboardComponent } from './dashboard.component';
//import { ViewerComponent } from './viewer.component';
import { IngestComponent } from './ingest.component';

const appRoutes: Routes = [
	/*
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full'
	},
	{
		path: 'dashboard',
		component: DashboardComponent
	},
	{
		path: 'viewer',
		component: ViewerComponent
	}
	*/
	{
		path: 'ingest',
		component: IngestComponent
	}
];

export const routing = RouterModule.forRoot(appRoutes);
