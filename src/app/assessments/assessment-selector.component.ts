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
import { ComposedSelectorSelect,
         ComposedSelectorEvent } 		from '../utils/composed-selector.component';

@Component({
    templateUrl: './assessment-selector.component.html',
    styleUrls: ['./assessment-selector.component.css']
})
export class AssessmentSelectorComponent implements OnInit, OnDestroy {
    selects: ComposedSelectorSelect[];
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
		//let changedSelect: any = document.getElementById(this.changedSelectId);
		switch(this.changedSelectId) {
		    case 'year':
			//changedSelect.value = this.selectedYear;
			this.selects[0] = this.cloneSelect(this.selects[0], this.selectedYear);
			break;
		    case 'course':
			//changedSelect.value = this.selectedCourseId;
			this.selects[1] = this.cloneSelect(this.selects[1], this.selectedCourseId);
			break;
		    case 'group':
			//changedSelect.value = this.selectedGroupId;
			this.selects[2] = this.cloneSelect(this.selects[2], this.selectedGroupId);
			break;
		    default:
			break;
		}

		this.changedSelectId = null;
	    }
	});
    }

    ngOnInit() {
	this.selects = [];
	[0, 1, 2].forEach(index => this.selects.push(this.emptySelect(index)));
	
	this.selectsSubscription = this.route.params
	    .subscribe((params: Params) => {
		const year = params['year'];
		const course_id = params['course_id'];
		const group_id = params['group_id'];
		
		// Reset navigation...
		if (year == '-1' && course_id == '-1' && group_id == '-1') {
		    [0, 1, 2].forEach(index => this.selects[index] = this.emptySelect(index));
		}
		
		if (this.selects[0].items.length == 0) {
		    this.assessmentsService.getGroupsSelectYear()
			.subscribe((select: ComposedSelectorSelect) => {
			    this.selects[0] = select;
			    select.selectedValue = year;
			});
		}
		
		if (year != this.selectedYear) {
		    this.selectedYear = year;
		    this.selects[2] = this.emptySelect(2);

		    if (year != '-1') {
			this.assessmentsService.getGroupsSelectCourse(year)
			    .subscribe((select: ComposedSelectorSelect) => {
				this.selects[1] = select
				select.selectedValue = course_id;
			    });
		    }
		    else {
			this.selects[1] = this.emptySelect(1);
		    }
		}

		if (course_id != this.selectedCourseId) {
		    this.selectedCourseId = course_id;

		    if (course_id != '-1') {
			this.assessmentsService.getGroupsSelectGroup(year, course_id)
			    .subscribe((select: ComposedSelectorSelect) => {
				this.selects[2] = select;
				select.selectedValue = group_id;
			    });
		    }
		    else {
			this.selects[2] = this.emptySelect(2);
		    }
		}

		if (group_id != this.selectedGroupId) {
		    this.selectedGroupId = group_id;
		    if (this.selectedYear != '-1' && this.selectedCourseId != '-1' && this.selectedGroupId != '-1' && this.route.children.length == 0) {
			this.router.navigate(['grades'], { relativeTo: this.route });
		    }
		}
	    });
    }

    ngOnDestroy() {
	this.selectsSubscription.unsubscribe();
	this.routerEventsSubscription.unsubscribe();
    }

    onSelectorChanged(event: ComposedSelectorEvent) {
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

    private emptySelect(index: number): ComposedSelectorSelect {
	var select: ComposedSelectorSelect = null;

	switch(index) {
	    case 0:
		select = new ComposedSelectorSelect('year', 'Any...', [], false, -1);
		break;
	    case 1:
                select = new ComposedSelectorSelect('course', 'Curs...', [], false, -1);
                break;
	    case 2:
                select = new ComposedSelectorSelect('group', 'Grup...', [], false, -1);
                break;
	    default:
		break
	}

	return select;
    }

    /*
     * This method is used to restore previous selected
     * value when navigation is cancelled.
     */
    private cloneSelect(select: ComposedSelectorSelect,
			newSelectedValue: any): ComposedSelectorSelect {
	if (select) {
	    return new ComposedSelectorSelect(
		select.id,
		select.placeholder,
		select.items,
		select.grouped,
		newSelectedValue
	    );
	}

	return null;

    }
}

