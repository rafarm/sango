import { NgModule } 			from '@angular/core';
import { CommonModule }			from '@angular/common';

import { AssessmentsComponent }		from './assessments.component';

import { AssessmentsRoutingModule }	from './assessments-routing.module';

@NgModule({
    imports: [
	CommonModule,
	AssessmentsRoutingModule
    ],
    declarations: [
	AssessmentsComponent
    ]
})

export class AssessmentsModule {}
