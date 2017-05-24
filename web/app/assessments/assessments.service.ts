import { Injectable } 			from '@angular/core';
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

@Injectable()
export class AssessmentsService {
    private cachedCourse: Course = null;
    private cachedGroup: Group = null;
    private cachedGrades = {};

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

	this.cachedGrades = {};
        let  call = 'assessments/bycourse/' + id + '/' + year;

        return this.backendService.get(call).do((course: Course) => this.cachedCourse = course);
    }

    /*
     * getGroup
     *
     * Returns group identified by 'id' with its students and subjects<!-- for 'year'-->.
     * Last result is cached for later use.
     */
    getGroup(id: string/*, year: string*/): Observable<Group> {
        if (this.cachedGroup != null && this.cachedGroup._id === id/* && this.cachedGroup.year === year*/) {
            return Observable.of(this.cachedGroup);
        }

        let call = 'students/bygroup/' + id/* + '/' + year*/;

        return this.backendService.get(call).do((group: Group) => this.cachedGroup = group);
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
     */
    getGrades(assessment_id: string, group_id: string): Observable<Grades> {
	let grades = this.cachedGrades[assessment_id];
	
	if (grades != undefined) {
	    return Observable.of(grades);
	}

	this.getGroup(group_id)
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

            	group.student.subjects.forEach(subject => {
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
}

