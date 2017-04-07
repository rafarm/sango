import { NgModule } 			from '@angular/core';

import { UtilsModule }			from '../utils/utils.module';

import { AssessmentsComponent }		from './assessments.component';

import { AssessmentsRoutingModule }	from './assessments-routing.module';

@NgModule({
    imports: [
	UtilsModule,
	AssessmentsRoutingModule
    ],
    declarations: [
	AssessmentsComponent
    ]
})

export class AssessmentsModule {}
