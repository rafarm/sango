import { Injectable } 		from '@angular/core';
import { Observable } 		from 'rxjs/Observable';
import { Observer } 		from 'rxjs/Observer';

import { BackendService } 	from '../backend.service';
 
@Injectable()
export class AssessmentsService {

    constructor(private backendService: BackendService) {};

}

