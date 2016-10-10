import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { SelectorCoursesTree } from './model/selector-courses-tree';

@Injectable()
export class DataService {
    private apiUrl = 'http://localhost:3000/api/';

    constructor(private http: Http) {}

    getCoursesByYear(): Promise<SelectorCoursesTree[]> {
	var coursesUrl = this.apiUrl + 'courses/byyear';
	
	return this.http.get(coursesUrl)
	    .toPromise()
	    .then(this.unwrapResponse)
	    .catch(this.handleError);
    }

    private unwrapResponse(res: Response) {
	let body = res.json();
	return body.data || {};
    }

    private handleError(error: any): Promise<any> {
	console.error('An error occurred: ', error);
	return Promise.reject(error.message || error);
    }
}
