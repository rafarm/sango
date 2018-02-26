import { Injectable } 		from '@angular/core';
import { Observable } 		from 'rxjs/Observable';
import { Observer } 		from 'rxjs/Observer';

import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/empty';

import { BackendService, UploadProgress } 	from '../core/backend.service';
 
@Injectable()
export class IngestService {

    constructor(private backendService: BackendService) {};

    /*
     * ingestFile
     *
     * Uploads and processes a data file in backend service.
     */
    ingestFile(file: File): Observable<string> {
	return this.backendService.uploadFile(file)
	    .concatMap(
		(value: UploadProgress) => {
		    switch(value.state) {
			case 1:
			    return Observable.of(value.data);
			case 4:
			    if (value.status == 200) {
				return this.backendService.processFile(value.data);
			    }
			    else {
				return Observable.throw(value.data);
			    }
			default:
			    return Observable.empty();
		    }
                }
	    );
    }
}

