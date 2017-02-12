import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import 'rxjs/add/operator/toPromise';

import { SelectorCoursesTree } from './model/selector-courses-tree';
import { Course } from './model/course';
import { Assessment } from './model/assessment';
import { Student } from './model/student';
import { AssessmentStats } from './model/assessment-stats';
import { Stats } from './model/stats';

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
     * getCourse
     *
     * Returns course identified by 'id'.
     */
    getCourse(id: string): Promise<Course> {
        let url = this.apiUrl + 'courses/' + id;

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
     * getStudentStats
     *
     * Returns students stats for the course identified by 'id'
     * and grouped by assessment.
     */
    getStudentStats(id: string): Promise<AssessmentStats[]> {
        let url = this.apiUrl + 'courses/' + id + '/stats/bystudent';

        return this.http.get(url)
            .toPromise()
            .then(this.unwrapResponse)
            .catch(this.handleError);
    }

    /*
     * getSubjectStats
     *
     * Returns subjects stats for the course identified by 'id'
     * and grouped by assessment.
     */
    getSubjectStats(id: string): Promise<AssessmentStats[]> {
        let url = this.apiUrl + 'courses/' + id + '/stats/bysubject';

        return this.http.get(url)
            .toPromise()
            .then(this.unwrapResponse)
            .catch(this.handleError);
    }

    /*
     * getLevelStats
     *
     * Returns subject stats for all the courses of the same year,
     * stage and level.
     */
    getLevelStats(year: number, stage: string, level: string, order: number): Promise<Stats[]> {
        let url = this.apiUrl + 'courses/' + year + '/'
	    + stage + '/' + level + '/' + order + '/stats/bysubject';

        return this.http.get(url)
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
     * uploadFile
     *
     * Uploads a file to server.
     */
    uploadFile(file: File) {
	let request = new Observable((observer: Observer<number>) => {
	    let formData = new FormData();
            let xhr = new XMLHttpRequest();

            formData.append('upload', file, file.name);

	    xhr.upload.onprogress = (event: ProgressEvent) => {
		if (event.lengthComputable) {
		    let completed = event.loaded / event.total * 100;
		    observer.next(completed);
		}
		else {
		    observer.next(-1);
		}
	    };

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        observer.complete();
                    }
                    else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.open('POST', this.apiUrl+'ingest', true);
            xhr.send(formData);
	});

	/*
	let request = new Promise((resolve, reject) => {
	    let formData = new FormData();
	    let xhr = new XMLHttpRequest();

	    formData.append('upload', file, file.name);

	    xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
		    if (xhr.status == 200) {
			resolve(JSON.parse(xhr.response));
		    }
		    else {
			reject(xhr.response);
		    }
		}
	    }

	    xhr.open('POST', this.apiUrl+'ingest', true);
	    xhr.send(formData);
	});
	*/

	return request;
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
