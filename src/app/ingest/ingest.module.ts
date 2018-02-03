import { NgModule } 		from '@angular/core';
import { CommonModule }		from '@angular/common';

import { CustomMaterialModule } from '../custom-material/custom-material.module';

import { IngestComponent }	from './ingest.component';

import { IngestRoutingModule }	from './ingest-routing.module';

@NgModule({
    imports: [
	CommonModule,
	CustomMaterialModule,
	IngestRoutingModule
    ],
    declarations: [
	IngestComponent
    ]
})

export class IngestModule {}
