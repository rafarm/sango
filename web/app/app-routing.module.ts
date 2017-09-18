import { NgModule } from '@angular/core';
import { Routes, RouterModule } 	from '@angular/router';

import { PageNotFoundComponent } 	from './not-found.component';
import { CanDeactivateGuard }		from './can-deactivate-guard.service';

const appRoutes: Routes = [
    {
	path: '', redirectTo: '/assessments/-1/-1/-1', pathMatch: 'full'
    },
    {
	path: '**', component: PageNotFoundComponent
    }
];

@NgModule({
    imports: [
	RouterModule.forRoot(appRoutes)
    ],
    exports: [
	RouterModule
    ],
    providers: [
	CanDeactivateGuard
    ]
})

export class AppRoutingModule {}
