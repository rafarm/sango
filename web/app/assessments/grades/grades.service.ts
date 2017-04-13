import { Injectable } 			from '@angular/core';
import { Observable } 			from 'rxjs/Observable';
import { Observer } 			from 'rxjs/Observer';

import 'rxjs/add/operator/map';

import { BackendService } 		from '../../core/backend.service';
import { Course } 			from '../../model/course';
import { Group } 			from '../../model/group';
import { Assessment } 			from '../../model/assessment';

@Injectable()
export class GradesService {

    constructor(private backendService: BackendService) {};

    /*
     * getCourse
     *
     * Returns course identified by 'id' with assessments for 'year'.
     */
    getCourse(id: string, year: string): Observable<Course> {
        let  call = 'assessments/bycourse/' + id + '/' + year;

        return this.backendService.get(call);
    }

    /*
     * getGroup
     *
     * Returns group identified by 'id' with its students and subjects for 'year'.
     */
    getGroup(id: string, year: string): Observable<Group> {
        let call = 'students/bygroup/' + id + '/' + year;

        return this.backendService.get(call);
    }

    /*
     * getAssessments
     *
     * Returns assessments' id, name and order.
     * Assessments list can optionally filtered by
     * year and course_id.
     */
    /*
    getAssessments(year?: string, course_id?: string): Observable<Assessment[]> {
        let call = 'assessments';

        if (year != undefined) {
            call = call + '?year=' + year;
        }
        if (course_id != undefined) {
            call = call + (year != undefined ? '&' : '?');
            call = call + 'course_id=' + course_id;
        }
	
	return this.backendService.get(call);
    }
    */

    /*
     * getAssessment
     *
     * Returns assessment identified by 'id'.
     */
    getAssessment(id: string): Observable<Assessment> {
        let call = 'assessments/' + id;

	return this.backendService.get(call);
    }
}

