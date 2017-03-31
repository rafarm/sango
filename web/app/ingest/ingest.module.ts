import { NgModule } 		from '@angular/core';

import { IngestComponent }	from './ingest.component';

import { IngestService }	from './ingest.service';

import { IngestRoutingModule }	from './ingest-routing.module';

@NgModule({
    imports: [
	IngestRoutingModule
    ],
    declarations: [
	IngestComponent
    ],
    providers: [
	IngestService
    ]
})

export class IngestModule {}
