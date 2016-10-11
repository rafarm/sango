import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { SelectorCoursesTree } from './model/selector-courses-tree';
import { Assessment } from './model/assessment';

@Injectable()
export class DataService {
    private apiUrl = 'http://localhost:3000/api/';

    constructor(private http: Http) {}

    /* getCousesByYear
     *
     * Queries server for courses grouped by year.
     */
    getCoursesByYear(): Promise<SelectorCoursesTree[]> {
	var url = this.apiUrl + 'courses/byyear';
	
	return this.http.get(url)
	    .toPromise()
	    .then(this.unwrapResponse)
	    .catch(this.handleError);
    }

    /*
     *
     */
    getAssessment(id: string): Promise<Assessment> {
        var url = this.apiUrl + 'assessments/' + id;

        return this.http.get(url)
            .toPromise()
            .then(this.unwrapResponse)
            .catch(this.handleError);
    }

    /* unwrapResponse
     *
     * Extracts data from server response.
     */

    private unwrapResponse(res: Response) {
	let body = res.json();
	return body.data || {};
    }

    /* handleError
     *
     * Basic server error handling.
     */
    private handleError(error: any): Promise<any> {
	console.error('An error occurred: ', error);
	return Promise.reject(error.message || error);
    }
}
