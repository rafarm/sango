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

import { PageNotFoundComponent }	from './not-found.component';

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
	PageNotFoundComponent,
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
