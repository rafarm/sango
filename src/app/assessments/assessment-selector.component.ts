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
    
    selectedYear = '-1';
    selectedCourseId = '-1';
    selectedGroupId = '-1';
    currentSelection: any[];

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
		this.currentSelection = [this.selectedYear,
		    		     this.selectedCourseId,
		    		     this.selectedGroupId];
	    }
	});
    }

    ngOnInit() {
	this.selects = [];
	[0, 1, 2].forEach(index => this.selects.push(this.emptySelect(index)));
	this.currentSelection = [];
	[0, 1, 2].forEach(index => this.currentSelection.push(''));
	
	this.selectsSubscription = this.route.params
	    .subscribe((params: Params) => {
		const year = params['year'];
		const course_id = params['course_id'];
		const group_id = params['group_id'];
		
		// Reset navigation...
		if (year == '-1' && course_id == '-1' && group_id == '-1') {
		    [0, 1, 2].forEach(index => this.selects[index] = this.emptySelect(index));
		    [0, 1, 2].forEach(index => this.currentSelection[index] = '');
		}
		
		if (this.selects[0].items.length == 0) {
		    this.assessmentsService.getGroupsSelectYear()
			.subscribe((select: ComposedSelectorSelect) => {
			    this.selects[0] = select;
			    this.currentSelection[0] = year;
			});
		}
		
		if (year != this.selectedYear) {
		    this.selectedYear = year;
		    this.selects[2] = this.emptySelect(2);

		    if (year != '-1') {
			this.assessmentsService.getGroupsSelectCourse(year)
			    .subscribe((select: ComposedSelectorSelect) => {
				this.selects[1] = select
				this.currentSelection[1] = course_id;
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
				this.currentSelection[2] = group_id;
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
		select = new ComposedSelectorSelect('year', 'Any...', [], false);
		break;
	    case 1:
                select = new ComposedSelectorSelect('course', 'Curs...', [], false);
                break;
	    case 2:
                select = new ComposedSelectorSelect('group', 'Grup...', [], false);
                break;
	    default:
		break
	}

	return select;
    }
}

