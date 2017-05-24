import { Injectable } 			from '@angular/core';
import { RequestOptions, Headers }	from '@angular/http';
import { Observable } 			from 'rxjs/Observable';
import { Observer } 			from 'rxjs/Observer';

import 'rxjs/add/operator/map';

import { BackendService } 		from '../../core/backend.service';
//import { Course } 			from '../../model/course';
import { Group } 			from '../../model/group';
//import { Assessment } 			from '../../model/assessment';
import { Grades } 			from '../../model/grades';

@Injectable()
export class GradesService {

    constructor(private backendService: BackendService) {};

    /*
     * getGroup
     *
     * Returns group identified by 'id' with its students and subjects for 'year'.
     */
    /*
    getGroup(id: string, year: string): Observable<Group> {
        let call = 'students/bygroup/' + id + '/' + year;

        return this.backendService.get(call);
    }
    */

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
    /*
    getAssessment(id: string): Observable<Assessment> {
        let call = 'assessments/' + id;

	return this.backendService.get(call);
    }
    */

    /*
     * getQualifications
     *
     * Returns qualifications for assessment id.
     * Qualifications can be optionally filtered by
     * group_id.
     */
    /*
    getQualifications(id: string, group_id?: string): Observable<any> {
        let call = 'assessments/' + id + '/qualifications';

        if (group_id != undefined) {
            call = call + '?group_id=' + group_id;
        }

        return this.backendService.get(call);
    }
    */

    /*
     * updateQualifications
     *
     * Update de grades for the assessment.
     */
    updateQualifications(grades: Grades): Observable<any> {
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

        let call = 'assessments/' + a_id + '/qualifications';
        let body = JSON.stringify(a_grades);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.backendService.put(call, body, options);
    }
}

