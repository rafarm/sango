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

//import { DataService } from './data.service';
import { AssessmentsService } 			from './assessments.service';
//import { Course } 				from '../model/course';
//import { Group } 				from '../model/group';
//import { Assessment } from './model/assessment';
//import { Student } from './model/student';
//import { AssessmentStats } from './model/assessment-stats';
//import { Stats } from './model/stats';
import { BreadcrumbSelectorSelect } 		from '../utils/breadcrumb-selector.component';
import { BreadcrumbSelectorEvent } 		from '../utils/breadcrumb-selector.component';

@Component({
    moduleId: module.id,
    templateUrl: './assessment-selector.component.html',
    styleUrls: ['./assessment-selector.component.css']
})
export class AssessmentSelectorComponent implements OnInit, OnDestroy {
    selects: BreadcrumbSelectorSelect[] = [];
    //removedSelects: BreadcrumbSelectorSelect[] = [];
    changedSelectId: string = null;
    
    selectedYear = '-1';
    selectedCourseId = '-1';
    selectedGroupId = '-1';

    private selectsSubscription: Subscription;
    private routerEventsSubscription: Subscription;
  
    //checkedButtonId: string;  
	
    constructor(
	private assessmentsService: AssessmentsService,
	private route: ActivatedRoute,
	private router: Router
    ) {
	// Restore selects state if navigation is cancelled...
	this.routerEventsSubscription = this.router.events.subscribe(event => {
	    if (event instanceof NavigationCancel) {
		// Restore changed select previous selected item...
		//let changedSelectIndex = this.selects.length - 1;
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

		/*
		// Restore previously removed selects...
		while(this.removedSelects.length > 0) {
		    this.selects.push(this.removedSelects.pop());
		}
		*/
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
                        //this.removedSelects.push(this.selects.pop());
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
                        //this.removedSelects.push(this.selects.pop());
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
		/*
		if (this.route.children.length == 0) {
                    this.router.navigate(['grades'], { relativeTo: this.route });
                }
		*/
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
	//this.removedSelects = [];

	this.changedSelectId = event.select_id;
	let value = event.select_value;
	switch(event.select_id) {
	    case 'year':
		//this.selectedGroupId = '-1';
		//this.selectedCourseId = '-1';
		/*	
		while(this.selects.length > 1) {
		    this.removedSelects.push(this.selects.pop());
		}
		*/
	    	this.router.navigate(
		    ['../../../', value, -1, -1],
		    { relativeTo: this.route }
		);

		break;
	    case 'course':
		//this.selectedGroupId = '-1';
		/*                
		while(this.selects.length > 2) {
                    this.removedSelects.push(this.selects.pop());
                }
		*/
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
	//this.checkedButtonId = "btn-grades";
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
	//console.log(this.route.children[0].children[0].children[0].snapshot.params);
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

    /*
    onButtonClicked(event: any) {
	this.checkedButtonId = event.target.id;
    }
    */

    isNavVisible(): boolean {
	return this.selectedYear != '-1' && this.selectedCourseId != '-1' && this.selectedGroupId != '-1';
    }

    /*
    onSelectedCourseChanged(event: string) {
        this.courseId = event;

        if (this.courseId != null) {
            this.loadCourse(this.courseId);
        }
        else {
            this.course = null;
            this.studentStats = null;
	    this.subjectStats = null;
	    this.levelStats = null;
        }
    }

    onSelectedAssessmentChanged(event: string) {
	this.assessmentId = event;

	if (this.assessmentId != null) {
	    this.loadAssessment(this.assessmentId);
	}
	else {
	    this.assessment = null;
	    this.students = null;
	}
    }

    private loadCourse(id: string) {
        this.dataService.getCourse(id)
            .then(course => this.course = course);
    }

    private loadAssessment(id: string) {
        this.dataService.getAssessment(id)
            .then(assessment => this.loadData(assessment));
    }

    onSaveAssessment(save: boolean) {
	if (save) {
	    this.dataService.replaceAssessment(this.assessment)
		.then(result => this.loadData(this.assessment));
	}
	else {
	    this.loadAssessment(this.assessmentId);
	}
    }

    private loadStats() {
	let course = this.course;

	// Get students stats
	this.dataService.getStudentStats(course._id)
	    .then(stats => this.processStudentStats(stats));

	// Get subject stats
	this.dataService.getSubjectStats(course._id)
	    .then(stats => this.processSubjectStats(stats));

	// Get course level stats
	this.dataService.getLevelStats(course.start_year,
				       course.stage,
				       course.level,
		    // TODO: Change when removing order from Course model...
				       this.assessmentOrder+1)
	    .then(stats => this.processLevelStats(stats));
    }

    private loadData(assessment: Assessment) {
	// Get students id array
        let ids: any[];
        for (var i=0; i<assessment.students.length; i++) {
            ids.push(assessment.students[i].student_id);
        }

        // Get students data
        this.dataService.getStudents(ids)
            .then(students => this.processStudents(students));

	this.assessment = assessment;

	// Find current assessment order in course
	var order = -1;
	let course = this.course;
        for (let i=0; i<course.assessments.length; i++) {
            let _a = course.assessments[i];
            if (_a.assessment_id === assessment._id) {
                order = i;
            }
	}
	this.assessmentOrder = order;

	// Load previous assessment in course
	if (order > 0) {
	    let _pId = this.course.assessments[order-1].assessment_id;
	    this.dataService.getAssessment(_pId)
		.then(assessment => this.prevAssessment = assessment);
	}

	// Get stats
        this.loadStats();
    }

    private processStudents(students: Student[]) {
	let s = {};

	for (let i=0; i<students.length; i++) {
	    s[students[i]._id] = students[i];
	}

	this.students = s;
    }

    private processStudentStats(stats: AssessmentStats[]) {
        this.studentStats = this.processAssessmentStats(stats);
    }

    private processSubjectStats(stats: AssessmentStats[]) {
        this.subjectStats = this.processAssessmentStats(stats);
    }

    private processAssessmentStats(stats: AssessmentStats[]): any {
        let assessmentHash = {};

        for (let i=0; i<stats.length; i++) {
            let _assessment = stats[i];
            let _stats = _assessment.stats;
            let _statsHash = {};
            
            for (let j=0; j<_stats.length; j++) {
                _statsHash[_stats[j]._id] = _stats[j];
            }
            
            let _assessmentHash = {};
            _assessmentHash['_id'] = _assessment._id;
            _assessmentHash['stats'] = _statsHash;

            assessmentHash[_assessment._id] = _assessmentHash;
        }

        return assessmentHash;
    }

    private processLevelStats(stats: Stats[]) {
	let subjectStats = {};

	for (let i=0; i<stats.length; i++) {
	    subjectStats[stats[i]._id] = stats[i];
	}

	this.levelStats = subjectStats;
    }
    */
}

