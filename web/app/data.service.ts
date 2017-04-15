import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
//import { Observable } from 'rxjs/Observable';
//import { Observer } from 'rxjs/Observer';

//declare var EventSource: any;

import 'rxjs/add/operator/toPromise';


//import { SelectorCoursesTree } from './model/selector-courses-tree';
import { BreadcrumbSelectorItem } from './utils/breadcrumb-selector.component';
import { BreadcrumbSelectorSelect } from './utils/breadcrumb-selector.component';
import { Grades } from './model/grades';
import { Grade } from './model/grade';
import { Course } from './model/course';
import { Assessment } from './model/assessment';
import { Group } from './model/group';
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
    /*
    getCoursesByYear(): Promise<SelectorCoursesTree[]> {
	let  url = this.apiUrl + 'courses/byyear';
	
	return this.http.get(url)
	    .toPromise()
	    .then(this.unwrapResponse)
	    .catch(this.handleError);
    }
    */

    /*
     * getCourse
     *
     * Returns course identified by 'id'.
     */
    /*
    getCourse(id: string): Promise<Course> {
        let url = this.apiUrl + 'courses/' + id;

        return this.http.get(url)
            .toPromise()
            .then(this.unwrapResponse)
            .catch(this.handleError);
    }
    */
    
    /*
     * getCourse
     *
     * Returns course identified by 'id' with its subjects and
     * assessments for 'year'.
     */
    getCourse(id: string, year: string): Promise<Course> {
        let url = this.apiUrl + 'assessments/bycourse/' + id + '/' + year;

        return this.http.get(url)
            .toPromise()
            .then(this.unwrapResponse)
            .catch(this.handleError);
    }

    /*
     * getGroup
     *
     * Returns group identified by 'id' with its students for 'year'.
     */
    getGroup(id: string, year: string): Promise<Group> {
        let url = this.apiUrl + 'students/bygroup/' + id + '/' + year;

        return this.http.get(url)
            .toPromise()
            .then(this.unwrapResponse)
            .catch(this.handleError);
    }

    /*
     * getAssessments
     *
     * Returns assessments' id, name and order.
     * Assessments list can optionally filtered by
     * year and course_id.
     */
    getAssessments(year?: string, course_id?: string): Promise<Assessment[]> {
        let url = this.apiUrl + 'assessments';

	if (year != undefined) {
	    url = url + '?year=' + year;
	}
	if (course_id != undefined) {
	    url = url + (year != undefined ? '&' : '?');
	    url = url + 'course_id=' + course_id;
	}
	
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
     * getQualifications
     *
     * Returns qualifications for assessment id.
     * Qualifications can be optionally filtered by
     * group_id.
     */
    getQualifications(id: string, group_id?: string): Promise<any> {
        let url = this.apiUrl + 'assessments/' + id + '/qualifications';

        if (group_id != undefined) {
            url = url + '?group_id=' + group_id;
        }

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
    /*
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
    */

    /*
     * updateQualifications
     *
     * Update de grades for the assessment.
     */
    updateQualifications(grades: Grades): Promise<any> {
	let a_id = grades.assessment_id;
	let st = grades.students;

	// Build assessment's grades array
	let g:any[] = [];
	Object.getOwnPropertyNames(st).forEach(st_id => {
	    let qs: any[] = [];
	    let st_g = st[st_id].grades;
	    Object.getOwnPropertyNames(st_g).forEach(sub_id => {
		let value = st_g[sub_id].value;
		if (value != null) {
	 	    let q = {
		    	subject_id: sub_id,
		    	qualification: value
		    };
		    qs.push(q);
		}
	    });

	    if (qs.length > 0) {
		let s = {
		    student_id: st_id,
		    qualifications: qs
		};
		g.push(s);
	    }
	});

	let a_grades = {
	    grades: g
	};

	//console.log(a_grades);
	
        let url = this.apiUrl + 'assessments/' + a_id + '/qualifications';
        let body = JSON.stringify(a_grades);
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
    /*
    uploadFile(file: File) {
	let request = new Observable((observer: Observer<any>) => {
	    let formData = new FormData();
            let xhr = new XMLHttpRequest();

            formData.append('upload', file, file.name);

	    xhr.upload.onprogress = (event: ProgressEvent) => {
		if (event.lengthComputable) {
		    let completed = event.loaded / event.total * 100;
		    observer.next(completed);
		}
		else {
		    observer.next("Uploading...");
		}
	    };

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
			let name = xhr.response; // Uploaded file name on server returned.

			let evtSource = new EventSource(this.apiUrl+'ingest/'+name);
			
			evtSource.onmessage = (e: any) => {
				observer.next(e.data);
			}

			evtSource.addEventListener("end", (e: any) => {
			    observer.complete();
			    evtSource.close();
			}, false);

			evtSource.addEventListener("error", (e: any) => {
                            observer.error(e.data);
                            evtSource.close();
                        }, false);
                    }
                    else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.open('POST', this.apiUrl+'ingest', true);
            xhr.send(formData);
	});

	return request;
    } 
    */

    /*
     * getGroupsSelectYear
     *
     * Returns the groups' year select to build group selector tree.
     */
    getGroupsSelectYear(): Promise<BreadcrumbSelectorSelect> {
        let  url = this.apiUrl + 'groups/tree/years';

        return this.http.get(url)
            .toPromise()
            .then(res => {
                let data = res.json().data;

		if (data != null) {
		    let items = data.map((value:any) => {
			return new BreadcrumbSelectorItem(value._id, value._id, false);
		    });
		    items.unshift(new BreadcrumbSelectorItem('Year...', '-1', false));

		    return new BreadcrumbSelectorSelect('year', items, -1);
		}

		return null;
            })
            .catch(this.handleError);
    }

    /*
     * getGroupSelectCourse
     *
     * Returns the groups' course select to build group selector tree.
     */
    getGroupsSelectCourse(year: string): Promise<BreadcrumbSelectorSelect> {
        let  url = this.apiUrl + 'groups/tree/' + year + '/courses';

        return this.http.get(url)
            .toPromise()
            .then(res => {
                let data = res.json().data;

                if (data != null) {
                    let parents = data.map((value:any) => {
			let courses = value.courses.map((value:any) => {
			    return new BreadcrumbSelectorItem(value.name, value._id, false);
			});
			
			let value_id = value._id.parent;
			if (value_id == null) {
			    value_id = value._id.stage;
			}

			return new BreadcrumbSelectorItem(value_id, courses, true);
                    });
                    parents.unshift(new BreadcrumbSelectorItem('Course...', '-1', false));

                    return new BreadcrumbSelectorSelect('course', parents, -1);
                }

                return null;
            })
            .catch(this.handleError);
    }

    /*
     * getGroupsSelectGroup
     *
     * Returns the groups' select for 'year' and 'course' to build group selector tree.
     */
    getGroupsSelectGroup(year: string, course: string): Promise<BreadcrumbSelectorSelect> {
        let  url = this.apiUrl + 'groups/tree/' + year + '/' + course + '/groups';

        return this.http.get(url)
            .toPromise()
            .then(res => {
                let data = res.json().data;

                if (data != null) {
                    let items = data.map((value:any) => {
                        return new BreadcrumbSelectorItem(value.short_name, value._id, false);
                    });
                    items.unshift(new BreadcrumbSelectorItem('Group...', '-1', false));

                    return new BreadcrumbSelectorSelect('group', items, -1);
                }

                return null;
            })
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
