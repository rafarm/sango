import { NgModule }      		from '@angular/core';
import { BrowserModule } 		from '@angular/platform-browser';
import { FormsModule }   		from '@angular/forms';
import { HttpModule } 	 		from '@angular/http';

import { AppComponent }  		from './app.component';
import { AppRoutingModule } 		from './app-routing.module';
import { CoreModule }			from './core/core.module';
import { UtilsModule }			from './utils/utils.module';
import { IngestModule }			from './ingest/ingest.module';
import { AssessmentsModule }		from './assessments/assessments.module';

//import { DashboardComponent } 	from './dashboard.component';
//import { AssessmentsComponent } 	from './assessments.component';
import { PageNotFoundComponent }	from './not-found.component';

//import { AssessmentsMarksComponent }	from './assessments-marks.component';
//import { BreadcrumbSelectorComponent } 	from './breadcrumb-selector.component';
//import { AssessmentTableComponent } 	from './assessment-table.component';
//import { AssessmentGroupComponent } 	from './assessment-group.component';
//import { AssessmentListComponent } 	from './assessment-list.component';
//import { StudentDetailComponent } 	from './student-detail.component';

// TO BE REMOVED--->
import { DataService } 			from './data.service';
//--->

//import { GoogleChartDirective } 	from './directives/google-chart.directive';
//import { CollapseDirective } 		from './directives/collapse.directive';

@NgModule({
    imports: [
	BrowserModule,
	FormsModule,
	HttpModule,
	CoreModule,
	UtilsModule,
	IngestModule,
	AssessmentsModule,
	AppRoutingModule
    ],
    declarations: [ 
	AppComponent,
	//DashboardComponent,
	//AssessmentsComponent,
	PageNotFoundComponent,
	//AssessmentsMarksComponent,
	//BreadcrumbSelectorComponent,
	//AssessmentTableComponent,
	//AssessmentGroupComponent,
	//AssessmentListComponent,
	//StudentDetailComponent,
	//GoogleChartDirective,
	//CollapseDirective
    ],
    providers: [
	// TO BE REMOVED--->
	DataService
	//--->
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
