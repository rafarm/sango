import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { SelectorCoursesTree } from './model/selector-courses-tree';
import { Assessment } from './model/assessment';
import { Student } from './model/student';

@Injectable()
export class DataService {
    private apiUrl = 'http://localhost:3000/api/';

    constructor(private http: Http) {}

    /*
     * getCousesByYear
     *
     * Queries server for courses grouped by year.
     */
    getCoursesByYear(): Promise<SelectorCoursesTree[]> {
	let  url = this.apiUrl + 'courses/byyear';
	
	return this.http.get(url)
	    .toPromise()
	    .then(this.unwrapResponse)
	    .catch(this.handleError);
    }

    /*
     * getAssessment
     *
     * Returns assessment identified by 'id'.
     */
    getAssessment(id: string): Promise<Assessment> {
        let url = this.apiUrl + 'assessments/' + id;

        return this.http.get(url)
            .toPromise()
            .then(this.unwrapResponse)
            .catch(this.handleError);
    }

    /*
     * replaceAssessment
     *
     * Replaces the assessment.
     */
    replaceAssessment(assessment: Assessment): Promise<any> {
	let url = this.apiUrl + 'assessments/' + assessment._id;
	let body = JSON.stringify(assessment);
	let headers = new Headers({ 'Content-Type': 'application/json' });
	let options = new RequestOptions({ headers: headers });

	return this.http.put(url, body, options)
	    .toPromise()
	    .then(this.unwrapResponse)
	    .catch(this.handleError);
    }

    /*
     * getStudents
     *
     * Returns the students identified by the array of ids.
     */
    getStudents(ids: string[]): Promise<Student[]> {
	var url = this.apiUrl + 'students';

	if (ids.length > 0) {
	    url += '?ids=' + ids[0];

	    for (var i=1; i<ids.length; i++) {
		url += '&ids=' +  ids[i];
	    }
	}

	return this.http.get(url)
            .toPromise()
            .then(this.unwrapResponse)
            .catch(this.handleError);
    }

    /*
     * unwrapResponse
     *
     * Extracts data from server response.
     */

    private unwrapResponse(res: Response) {
	let body = res.json();
	return body.data || {};
    }

    /*
     * handleError
     *
     * Basic server error handling.
     */
    private handleError(error: any): Promise<any> {
	console.error('An error occurred: ', error);
	return Promise.reject(error.message || error);
    }
}
