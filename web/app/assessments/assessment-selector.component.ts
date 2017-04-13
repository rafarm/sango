import { Component, OnInit, OnDestroy } 	from '@angular/core';
import { Router, ActivatedRoute, Params }	from '@angular/router';
import { Observable }                   	from 'rxjs/Observable';
import { Subscription }				from 'rxjs/Subscription';

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
    styleUrls: ['./assessment-selector.component.css'],
    providers: [ AssessmentsService ]
})
export class AssessmentSelectorComponent implements OnInit, OnDestroy {
    selects: BreadcrumbSelectorSelect[] = [];
    
    selectedYear: string = null;
    selectedCourseId: string = null;
    selectedGroupId: string = null;

    private selectsSubscription: Subscription;
  
    checkedButtonId: string;  
	
    constructor(
	private assessmentsService: AssessmentsService,
	private route: ActivatedRoute,
	private router: Router
    ) {}

    ngOnInit() {
	/*let group_id = this.route.snapshot.params['group_id'];
	console.log('AssessmentSelector - group_id:' + group_id);*/
	this.selectsSubscription = this.route.params
	    .switchMap((params: Params) => {
		const year = params['year'];
		const course_id = params['course_id'];
		const group_id = params['group_id'];
		let yearObservable = Observable.empty();
		let courseObservable = Observable.empty();
		let groupObservable =  Observable.empty();

		if (this.selects.length == 0) {
		    yearObservable = this.assessmentsService.getGroupsSelectYear();
		}
		
		if (year != undefined && year != this.selectedYear) {
		    this.selectedYear = year;
		    courseObservable = this.assessmentsService.getGroupsSelectCourse(year);
		}

		if (year != undefined && course_id != undefined && course_id != this.selectedCourseId) {
		    this.selectedCourseId = course_id;
		    groupObservable = this.assessmentsService.getGroupsSelectGroup(year, course_id);
		}

		if (year != undefined && course_id != undefined && group_id != undefined && group_id != this.selectedGroupId) {
		    this.selectedGroupId = group_id;
		}

		if (this.route.children.length == 0) {
                    this.router.navigate(['grades'], { relativeTo: this.route });
                }

		return Observable.concat(yearObservable, courseObservable, groupObservable);
	    }).subscribe((select: BreadcrumbSelectorSelect) => this.selects.push(select));
    }

    ngOnDestroy() {
	this.selectsSubscription.unsubscribe();
    }

    onSelectorChanged(event: BreadcrumbSelectorEvent) {
	let value = event.select_value;
	switch(event.select_id) {
	    case 'year':
		this.selectedGroupId = null;
		this.selectedCourseId = null;
                
		while(this.selects.length > 1) {
		    this.selects.pop();
		}
		
		if (value == -1) {
		    this.selectedYear = null;
		    this.router.navigate(['../'], { relativeTo: this.route });
		}
 		else {
		    /*
		    this.selectedYear = value;
		    this.assessmentsService.getGroupsSelectCourse(this.selectedYear)
			.subscribe(select => this.selects.push(select));
		    */
		    this.router.navigate([value], { relativeTo: this.route });
		}
		break;
	    case 'course':
		this.selectedGroupId = null;
                
		while(this.selects.length > 2) {
                    this.selects.pop();
                }
		
		if (value == '-1') {
		    this.selectedCourseId = null;
		    this.router.navigate(['../'], { relativeTo: this.route });
		}
                else {
		    //this.selectedCourseId = value
		    /*
		    this.assessmentsService.getCourse(value, this.selectedYear)
			.subscribe(course => this.selectedCourse = course);
                    this.assessmentsService.getGroupsSelectGroup(this.selectedYear, value)
                        .subscribe(select => this.selects.push(select));
		    */
		    this.router.navigate([value], { relativeTo: this.route });
                }
		break;
	    case 'group':
		//this.selectedGroupId = value == -1 ? null : value;
		if (value == -1) {
		    this.selectedGroupId = null;
		    this.router.navigate(['../'], { relativeTo: this.route });
		}
		else {
		    /*
		    this.assessmentsService.getGroup(value, this.selectedYear)
                        .subscribe(group => this.selectedGroup = group);
		    */
		    this.router.navigate([value], { relativeTo: this.route });
		}
		break;
	    default:
		break;
	}

	//this.checkedButtonId = "btn-grades";
    }

    onButtonClicked(event: any) {
	this.checkedButtonId = event.target.id;
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

