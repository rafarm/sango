import { Injectable } 			from '@angular/core';
import { RequestOptions, Headers }      from '@angular/http';
import { Observable } 			from 'rxjs/Observable';
import { Observer } 			from 'rxjs/Observer';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { BackendService } 		from '../core/backend.service';
import { BreadcrumbSelectorItem } 	from '../utils/breadcrumb-selector.component';
import { BreadcrumbSelectorSelect } 	from '../utils/breadcrumb-selector.component';
import { Course } 			from '../model/course';
import { Group } 			from '../model/group';
import { Grades } 			from '../model/grades';
import { Grade }                        from '../model/grade';

@Injectable()
export class AssessmentsService {
    private cachedCourse: Course = null;
    private cachedGroup: Group = null;
    private cachedGrades = {};
    private cachedStudentStats = {};
    private cachedSubjectStats = {};
    private cachedLevelSubjectStats = {};

    constructor(private backendService: BackendService) {};

    /*
     * getGroupsSelectYear
     *
     * Returns the groups' year select to build group selector tree.
     */
    getGroupsSelectYear(): Observable<BreadcrumbSelectorSelect> {
        let  call = 'groups/tree/years';

        return this.backendService.get(call)
	    .map((data: any) => {
                if (data != null) {
                    let items = data.map((value:any) => {
                        return new BreadcrumbSelectorItem(value._id, value._id, false);
                    });
                    items.unshift(new BreadcrumbSelectorItem('Year...', '-1', false));

                    return new BreadcrumbSelectorSelect('year', items, -1);
                }

                return null;
            })
    }

    /*
     * getGroupSelectCourse
     *
     * Returns the groups' course select to build group selector tree.
     */
    getGroupsSelectCourse(year: string): Observable<BreadcrumbSelectorSelect> {
        let  call = 'groups/tree/' + year + '/courses';

        return this.backendService.get(call)
            .map((data: any) => {
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
    }

    /*
     * getGroupsSelectGroup
     *
     * Returns the groups' select for 'year' and 'course' to build group selector tree.
     */
    getGroupsSelectGroup(year: string, course: string): Observable<BreadcrumbSelectorSelect> {
        let call = 'groups/tree/' + year + '/' + course + '/groups';

        return this.backendService.get(call)
            .map((data: any) => {
                if (data != null) {
                    let items = data.map((value:any) => {
                        return new BreadcrumbSelectorItem(value.short_name, value._id, false);
                    });
                    items.unshift(new BreadcrumbSelectorItem('Group...', '-1', false));

                    return new BreadcrumbSelectorSelect('group', items, -1);
                }

                return null;
            })
    }

    private clearCache() {
	this.cachedCourse = null;
	this.cachedGroup = null;
        this.cachedGrades = {};
	this.cachedStudentStats = {};
	this.cachedSubjectStats = {};
	this.cachedLevelSubjectStats = {};
    }

    /*
     * getCourse
     *
     * Returns course identified by 'id' with assessments for 'year'.
     * Last result is cached for later use.
     */
    getCourse(id: string, year: string): Observable<Course> {
	if (this.cachedCourse != null && this.cachedCourse.year === year && this.cachedCourse._id === id) {
            return Observable.of(this.cachedCourse);
	}

	this.clearCache();
        let  call = 'assessments/bycourse/' + id + '/' + year;

        return this.backendService.get(call).do((course: Course) => {
            this.cachedCourse = course;
        });
    }

    /*
     * getGroup
     *
     * Returns group identified by 'id' with its students and subjects.
     * Last result is cached for later use.
     */
    getGroup(id: string): Observable<Group> {
        if (this.cachedGroup != null && this.cachedGroup._id === id) {
            return Observable.of(this.cachedGroup);
        }

	this.clearCache();
        let call = 'students/bygroup/' + id/* + '/' + year*/;

        return this.backendService.get(call).do((group: Group) => {
            this.cachedGroup = group;
        });
    }

    /*
     * getQualifications
     *
     * Returns qualifications for assessment id.
     * Qualifications can be optionally filtered by
     * group_id.
     */
    getQualifications(assessment_id: string, group_id?: string): Observable<any> {
        let call = 'assessments/' + assessment_id + '/qualifications';

        if (group_id != undefined) {
            call = call + '?group_id=' + group_id;
        }

        return this.backendService.get(call);
    }

    /*
     * getGrades
     *
     * Returns grades from qualifications for assessment_id, optionally
     * filtered by group_id.
     * If no qualifications are returned from backend, generates empty
     * grades structure.
     * Last result is cached for later use.
     */
    getGrades(assessment_id: string, group_id: string): Observable<Grades> {
	let grades = this.cachedGrades[assessment_id];
	
	if (grades != undefined) {
	    return Observable.of(grades);
	}

	return this.getQualifications(assessment_id, group_id)
            .concatMap(res => {
                return this.generateGrades(assessment_id, group_id)
                    .concatMap((grades: Grades) => {
                        if (res.grades != undefined) {
                            res.grades.forEach((st: any) => {
                                st.qualifications.forEach((q: any) => {
                                    let gs = grades.students[st.student_id].grades;
                                    gs[q.subject_id].value = q.qualification;
                                });
                            });
                        }
                        this.cachedGrades[assessment_id] = grades;
                
                        return Observable.of(grades);
                    });
            });
    }

    private generateGrades(assessment_id: string, group_id: string): Observable<Grades> {
	return this.getGroup(group_id).map((group: Group) => {
	    let grades = new Grades();
            grades.assessment_id = assessment_id;
            grades.students = {};

            group.students.forEach(student => {
                let marks = {};
            	group.subjects.forEach(subject => {
                    marks[subject._id] = new Grade();
            	});

            	student.subjects.forEach(subject => {
                    let mark = marks[subject.subject_id];
                    mark.adapted = subject.adapted;
                    mark.enroled = true;
            	});

           	let qualifications = {};
            	    qualifications['grades'] = marks;

                    grades.students[student._id] = qualifications;
            });

            return grades;
	});
    }

    /*
     * updateQualifications
     *
     * Update de grades for the assessment.
     */
    updateQualifications(grades: Grades): Observable<any> {
	this.clearCache();
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

        let call = 'assessments/' + a_id + '/qualifications';
        let body = JSON.stringify(a_grades);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.backendService.put(call, body, options);
    }

    /*
     * getStudentStats
     *
     * Returns students stats for the assessment_id.
     * Optionally filtered by group_id.
     */
    getStudentStats(assessment_id: string, group_id?: string): Observable<any> {
        let stats = this.cachedStudentStats[assessment_id];

        if (stats != undefined) {
            return Observable.of(stats);
        }

        let call = 'assessments/' + assessment_id + '/stats/bystudent';

        if (group_id != undefined) {
            call = call + '?group_id=' + group_id;
        }

        return this.backendService.get(call)
	    .concatMap((res: any) => {
		let _stats = {};
		_stats['_id'] = assessment_id;

		let _s = {};
		if (res.stats != undefined) {
                    res.stats.forEach((std: any) => {
		        _s[std.student_id] = std;
		    });

		    _stats['stats'] = _s;

		    this.cachedStudentStats[assessment_id] = _stats;
		}
		
		return Observable.of(_stats);
            });
    }

    /*
     * getSubjectStats
     *
     * Returns subjects stats for the assessment_id.
     * Optionally filtered by group_id.
     */
    getSubjectStats(assessment_id: string, group_id?: string): Observable<any> {
	let cache: any;
        let call = 'assessments/' + assessment_id + '/stats/bysubject';

        if (group_id == undefined) {
	    cache = this.cachedLevelSubjectStats;
        }
	else {
	    cache = this.cachedSubjectStats;
	    call = call + '?group_id=' + group_id;
	}
	
	let stats = cache[assessment_id];

        if (stats != undefined) {
            return Observable.of(stats);
        }

        return this.backendService.get(call)
            .concatMap((res: any) => {
                let _stats = {};
		_stats['_id'] = assessment_id;

		let _s = {};
                if (res.stats != undefined) {
                    res.stats.forEach((sb: any) => {
                        _s[sb.subject_id] = sb;
                    });
		    
		    _stats['stats'] = _s;
                    cache[assessment_id] = _stats;
                }

                return Observable.of(_stats);
            });
    }
}

