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

@Injectable()
export class AssessmentsService {
    private currentCourse: Course = null;

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
     */
    getCourse(id: string, year: string): Observable<Course> {
	if (this.currentCourse != null && this.currentCourse.year === year && this.currentCourse._id === id) {
            return Observable.of(this.currentCourse);
	}

        let  call = 'assessments/bycourse/' + id + '/' + year;

        return this.backendService.get(call).do((course: Course) => this.currentCourse = course);
    }
}

