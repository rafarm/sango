import { NgModule }      		from '@angular/core';
import { BrowserModule } 		from '@angular/platform-browser';
//import { FormsModule }   		from '@angular/forms';
import { HttpModule } 	 		from '@angular/http';

import { routing } 			from './app.routing';
import { AppComponent }  		from './app.component';
//import { DashboardComponent } 		from './dashboard.component';
import { AssessmentsComponent } 		from './assessments.component';
import { IngestComponent } 		from './ingest.component';
import { AssessmentsMarksComponent }	from './assessments-marks.component';
import { BreadcrumbSelectorComponent } 	from './breadcrumb-selector.component';
import { AssessmentTableComponent } 	from './assessment-table.component';
//import { AssessmentGroupComponent } 	from './assessment-group.component';
//import { AssessmentListComponent } 	from './assessment-list.component';
//import { StudentDetailComponent } 	from './student-detail.component';
import { DataService } 			from './data.service';
//import { GoogleChartDirective } 	from './directives/google-chart.directive';
import { CollapseDirective } 	from './directives/collapse.directive';

@NgModule({
    imports: [
	BrowserModule,
	//FormsModule,
	routing,
	HttpModule
    ],
    declarations: [ 
	AppComponent,
	//DashboardComponent,
	AssessmentsComponent,
	IngestComponent,
	AssessmentsMarksComponent,
	BreadcrumbSelectorComponent,
	AssessmentTableComponent,
	//AssessmentGroupComponent,
	//AssessmentListComponent,
	//StudentDetailComponent,
	//GoogleChartDirective,
	CollapseDirective
    ],
    providers: [ DataService ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
