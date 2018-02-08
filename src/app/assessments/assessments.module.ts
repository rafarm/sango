import { NgModule } 				from '@angular/core';

import { UtilsModule }				from '../utils/utils.module';
import { CustomMaterialModule }			from '../custom-material/custom-material.module';

import { AssessmentsComponent }			from './assessments.component';
import { AssessmentSelectorComponent }		from './assessment-selector.component';
import { AssessmentsDividerBaseComponent }	from './assessments-divider-base.component';
import { AssessmentsService }			from './assessments.service';

import { AssessmentsRoutingModule }	from './assessments-routing.module';

@NgModule({
    imports: [
	UtilsModule,
	CustomMaterialModule,
	AssessmentsRoutingModule
    ],
    declarations: [
	AssessmentsComponent,
	AssessmentSelectorComponent,
	AssessmentsDividerBaseComponent,
    ],
    providers: [
        AssessmentsService
    ]
})

export class AssessmentsModule {}
