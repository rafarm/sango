import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
//import { DashboardComponent } from './dashboard.component';
import { AssessmentsComponent } from './assessments.component';
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
	*/
	{
		path: 'assessments',
		component: AssessmentsComponent
	},
	{
		path: 'ingest',
		component: IngestComponent
	}
];

export const routing = RouterModule.forRoot(appRoutes);
