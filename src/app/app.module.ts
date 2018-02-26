import { NgModule }      		from '@angular/core';
import { BrowserModule } 		from '@angular/platform-browser';
import { FormsModule }   		from '@angular/forms';
import { HttpClientModule } 	 	from '@angular/common/http';
import { BrowserAnimationsModule } 	from '@angular/platform-browser/animations';

import { AppRoutingModule } 		from './app-routing.module';
import { CoreModule }			from './core/core.module';
import { UtilsModule }			from './utils/utils.module';
import { IngestModule }			from './ingest/ingest.module';
import { AssessmentsModule }		from './assessments/assessments.module';
import { CustomMaterialModule }		from './custom-material/custom-material.module';

import { AppComponent }  		from './app.component';
import { PageNotFoundComponent }	from './not-found.component';
import { LogoutComponent }		from './logout.component';
import { SangoNavbarComponent } 	from './sango-navbar/sango-navbar.component';

@NgModule({
    imports: [
	BrowserModule,
	FormsModule,
	HttpClientModule,
	BrowserAnimationsModule,
	CoreModule,
	UtilsModule,
	IngestModule,
	AssessmentsModule,
	CustomMaterialModule,
	AppRoutingModule
    ],
    declarations: [ 
	AppComponent,
	PageNotFoundComponent,
	LogoutComponent,
	SangoNavbarComponent
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
