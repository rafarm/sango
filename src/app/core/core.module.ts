import { NgModule, Optional, SkipSelf }	from '@angular/core';
import { CommonModule }			from '@angular/common';

import { BackendService }		from './backend.service';
import { ConfigService }		from './config.service';

@NgModule({
    imports: [ CommonModule ],
    exports: [ CommonModule ],
    providers: [ 
	BackendService,
	ConfigService,
    ]
})

export class CoreModule {
    constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
	if (parentModule) {
	    throw new Error('CoreModule is already loaded. Import it in the AppModule only');
	}
    }
}
