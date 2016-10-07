import { NgModule }      		from '@angular/core';
import { BrowserModule } 		from '@angular/platform-browser';
import { FormsModule }   		from '@angular/forms';
import { HttpModule } 	 		from '@angular/http';
import { NgbModule }     		from '@ng-bootstrap/ng-bootstrap';

import { routing } 			from './app.routing';
import { AppComponent }  		from './app.component';
import { DashboardComponent } 		from './dashboard.component';
import { ViewerComponent } 		from './viewer.component';
import { AssessmentSelectorComponent } 	from './assessment-selector.component';
//import { SessionTableComponent } 	from './session-table.component';
//import { SessionGroupComponent } 	from './session-group.component';
//import { SessionListComponent } 	from './session-list.component';
//import { StudentDetailComponent } 	from './student-detail.component';
import { DataService } 			from './data.service';
//import { GoogleChartDirective } 	from './directives/google-chart.directive';

@NgModule({
    imports: [
	BrowserModule,
	FormsModule,
	routing,
	NgbModule,
	HttpModule
    ],
    declarations: [ 
	AppComponent,
	DashboardComponent,
	ViewerComponent,
	AssessmentSelectorComponent,
	//SessionTableComponent,
	//SessionGroupComponent,
	//SessionListComponent,
	//StudentDetailComponent,
	//GoogleChartDirective
    ],
    providers: [ DataService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
