import { NgModule } 		from '@angular/core';
import { CommonModule }		from '@angular/common';

import { IngestComponent }	from './ingest.component';

import { IngestRoutingModule }	from './ingest-routing.module';

@NgModule({
    imports: [
	CommonModule,
	IngestRoutingModule
    ],
    declarations: [
	IngestComponent
    ]
})

export class IngestModule {}
