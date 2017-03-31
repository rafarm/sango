import { NgModule }		from '@angular/core';
import { RouterModule, Routes }	from '@angular/router';

import { IngestComponent }	from './ingest.component';

const ingestRoutes: Routes = [
    {
	path: 'ingest', component: IngestComponent
    }
];

@NgModule({
    imports: [
	RouterModule.forChild(ingestRoutes)
    ],
    exports: [
	RouterModule
    ]
})

export class IngestRoutingModule {}
