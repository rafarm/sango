import { Component,
	 OnInit,
	 OnDestroy } 		from '@angular/core';
import { Router,
	 ActivatedRoute,
	 Params,
	 NavigationCancel }	from '@angular/router';
import { Observable }           from 'rxjs/Observable';
import { Subscription }		from 'rxjs/Subscription';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/concat';

import { AssessmentsService } 			from './assessments.service';
import { BreadcrumbSelectorSelect } 		from '../utils/breadcrumb-selector.component';
import { BreadcrumbSelectorEvent } 		from '../utils/breadcrumb-selector.component';

@Component({
    moduleId: module.id,
    templateUrl: './assessment-selector.component.html',
    styleUrls: ['./assessment-selector.component.css']
})
export class AssessmentSelectorComponent implements OnInit, OnDestroy {
    selects: BreadcrumbSelectorSelect[] = [];
    changedSelectId: string = null;
    
    selectedYear = '-1';
    selectedCourseId = '-1';
    selectedGroupId = '-1';

    private selectsSubscription: Subscription;
    private routerEventsSubscription: Subscription;
  
    constructor(
	private assessmentsService: AssessmentsService,
	private route: ActivatedRoute,
	private router: Router
    ) {
	// Restore selects state if navigation is cancelled...
	this.routerEventsSubscription = this.router.events.subscribe(event => {
	    if (event instanceof NavigationCancel) {
		// Restore changed select previous selected item...
		let changedSelect: any = document.getElementById(this.changedSelectId);
		switch(this.changedSelectId) {
		    case 'year':
			changedSelect.value = this.selectedYear;
			break;
		    case 'course':
			changedSelect.value = this.selectedCourseId;
			break;
		    case 'group':
			changedSelect.value = this.selectedGroupId;
			break;
		    default:
			break;
		}

		this.changedSelectId = null;
	    }
	});
    }

    ngOnInit() {
	this.selectsSubscription = this.route.params
	    .switchMap((params: Params) => {
		const year = params['year'];
		const course_id = params['course_id'];
		const group_id = params['group_id'];
		let yearObservable = Observable.empty();
		let courseObservable = Observable.empty();
		let groupObservable =  Observable.empty();

		// Reset navigation...
		if (year == '-1' && course_id == '-1' && group_id == '-1') {
		    this.selects = [];
		}

		if (this.selects.length == 0) {
		    yearObservable = this.assessmentsService.getGroupsSelectYear()
			.map((select: BreadcrumbSelectorSelect) => {
			    select.selectedValue = year;
			    return select;
			});
		}
		
		if (year != this.selectedYear) {
		    this.selectedYear = year;

		    while(this.selects.length > 1) {
                        this.selects.pop();
                    }

		    if (year != '-1') {
			courseObservable = this.assessmentsService.getGroupsSelectCourse(year)
			    .map((select: BreadcrumbSelectorSelect) => {
				select.selectedValue = course_id;
				return select;
			    });
		    }
		}

		if (course_id != this.selectedCourseId) {
		    this.selectedCourseId = course_id;

		    while(this.selects.length > 2) {
                        this.selects.pop();
                    }

		    if (course_id != '-1') {
			groupObservable = this.assessmentsService.getGroupsSelectGroup(year, course_id)
			    .map((select: BreadcrumbSelectorSelect) => {
				select.selectedValue = group_id;
				return select;
			    });
		    }
		}

		if (group_id != this.selectedGroupId) {
		    this.selectedGroupId = group_id;
		    if (this.selectedYear != '-1' && this.selectedCourseId != '-1' && this.selectedGroupId != '-1' && this.route.children.length == 0) {
			this.router.navigate(['grades'], { relativeTo: this.route });
		    }
		}
		return Observable.concat(yearObservable, courseObservable, groupObservable);
	    }).subscribe(
		    (select: BreadcrumbSelectorSelect) => this.selects.push(select),
		    error => this.router.navigate(['notfound'])
		);
    }

    ngOnDestroy() {
	this.selectsSubscription.unsubscribe();
	this.routerEventsSubscription.unsubscribe();
    }

    onSelectorChanged(event: BreadcrumbSelectorEvent) {
	this.changedSelectId = event.select_id;
	let value = event.select_value;
	switch(event.select_id) {
	    case 'year':
	    	this.router.navigate(
		    ['../../../', value, -1, -1],
		    { relativeTo: this.route }
		);

		break;
	    case 'course':
	    	this.router.navigate(
		    ['../../../',this.selectedYear, value, -1],
		    { relativeTo: this.route }
		);

		break;
	    case 'group':
		this.router.navigate(
                    ['../../../',this.selectedYear, this.selectedCourseId, value],
                    { relativeTo: this.route }
                );
    	
		break;
	    default:
		break;
	}
    }

    onNavigate(child: string) {
	let route = [child];

	// Awful code. I know...
	if (this.route.children.length > 0 && 
	    this.route.children[0].children.length > 0 &&
            this.route.children[0].children[0].children.length > 0) {
	    route.push(this.route.children[0].children[0].children[0].snapshot.params['assessment_id']);
        }

	this.router.navigate(route, {relativeTo: this.route});
    }

    isNavActive(navItem: string): boolean {
	let url = this.route.snapshot.url.join('/') + '/' + navItem;
	let parent = this.route.snapshot.parent;
	while(parent != null) {
	    url = parent.url.join('/') + '/' + url;
	    parent = parent.parent;
	}
	
	return this.router.isActive(url, false);
    }

    isNavVisible(): boolean {
	return this.selectedYear != '-1' && this.selectedCourseId != '-1' && this.selectedGroupId != '-1';
    }
}

