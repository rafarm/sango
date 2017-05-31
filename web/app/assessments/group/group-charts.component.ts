import { Component, OnInit, OnDestroy } 	from '@angular/core';
import { Router, ActivatedRoute, Params }       from '@angular/router';
import { Observable }                           from 'rxjs/Observable';
import { Subscription }                         from 'rxjs/Subscription';

import { AssessmentsService }			from '../assessments.service';

import { Group }                        	from '../../model/group';
//import { Course } from '../../model/course';
//import { Student } from './model/student';
//import { AssessmentStats } from './model/assessment-stats';
    
@Component({
    moduleId: module.id,
    templateUrl: './group-charts.component.html'
})
export class GroupChartsComponent implements OnInit, OnDestroy {
    /*
    @Input()
    course: Course;
    @Input()
    assessmentOrder: number;
    @Input()
    students: any;
    @Input()
    studentStats: any;
    @Input()
    subjectStats: any;
    @Input()
    levelStats: any;
    */
    year: string;
    group_id: string;
    assessment_id: string;
    studentStats: any;
    students: any;

    private statsSubscription: Subscription;

    /*
    pie_ChartData: any[];
    pie_ChartOptions: {};
    histogram_ChartData: any[];
    histogram_ChartOptions: {};
    averages_ChartData: any[];
    averages_ChartOptions: {};
    ratios_ChartData: any[];
    ratios_ChartOptions: {};
    */

    constructor(
	private assessmentsService: AssessmentsService,
	private route: ActivatedRoute,
	private router: Router
    ) {
	/*
	this.pie_ChartOptions = {
	    title: 'Assignatures suspeses',
	    titleTextStyle: {
		fontSize: 18
	    },
	    fontSize: 22,
	    legend: {
		position: 'labeled'
	    },
	    pieSliceText: 'none',
	    chartArea: {
		width: '90%'
	    }
	}
	this.histogram_ChartOptions = {
	    title: 'Assignatures aprovades',
	    titleTextStyle: {
		fontSize: 18
	    },
	    legend: {
		position: 'none'
	    },
	    chartArea: {
		width: '90%'
	    },
	    histogram: {
		bucketSize: 1,
		minValue: 0
	    },
	    vAxis: {
		gridlines: {
		    count: 7
		},
		maxValue: 10,
		minValue: 0
	    }
	}	
	this.averages_ChartOptions = {
	    title: 'Mitjanes per assignatura',
	    titleTextStyle: {
		fontSize: 18
	    },
	    legend: {
		position: 'top',
		alignment: 'end'
	    },
	    chartArea: {
		width: '90%'
	    },
	    vAxis: {
		gridlines: {
		    count: 3
		},
		maxValue: 10,
		minValue: 0
	    },
	    seriesType: 'bars',
	    series: {
		0: {
		    type: 'line'
		}
	    }
	}
	this.ratios_ChartOptions = {
            title: 'Ratio aprovats per assignatura',
            titleTextStyle: {
                fontSize: 18
            },
            legend: {
                position: 'top',
                alignment: 'end'
            },
            chartArea: {
                width: '90%'
            },
            vAxis: {
                gridlines: {
                    count: 3
                },
                maxValue: 1,
                minValue: 0
            },
            seriesType: 'bars',
            series: {
                0: {
                    type: 'line'
                }
            }
        }
	*/
    }

    ngOnInit() {
	this.year = this.route.parent.parent.parent.snapshot.params['year'];
        this.group_id = this.route.parent.parent.parent.snapshot.params['group_id'];
	this.statsSubscription = this.route.params.subscribe((params: Params) => {
	    this.assessment_id = params['assessment_id'];

	    // Get students...
	    this.assessmentsService.getGroup(this.group_id)
		.subscribe((group: Group) => this.students = group.students/*{
		    let s = {};
        	    group.students.forEach(st => s[st._id] = st);
        	    this.students = s;
		}*/);

	    // Get students' stats...
	    this.assessmentsService.getStudentStats(this.assessment_id, this.group_id).subscribe((stats: any) => this.studentStats = stats);
	    
	    // TODO: Get stats...
	});
    }

    ngOnDestroy() {
        this.statsSubscription.unsubscribe();
    }

    /*
    ngOnChanges(changes: SimpleChanges) {
	// Reset
	this.pie_ChartData = [];
	this.histogram_ChartData = [];
	this.averages_ChartData = [];
	this.ratios_ChartData = [];
	
	this.setPieData();
	this.setHistogramData();
	this.setAveragesData();
	this.setRatiosData();    
    }

    private setPieData() {
	let pie_data = this.pie_ChartData;
        pie_data.push( ['#Suspeses', '#Alumnes'] );
        pie_data.push( ['Cap', 0] );
        pie_data.push( ['1', 0] );
        pie_data.push( ['2', 0] );
        pie_data.push( ['3', 0] );
        pie_data.push( ['4+', 0] );
        
	for (let i in this.studentStats) {
            let num_failed = this.studentStats[i].failed;
            if (num_failed <= 3) {
                pie_data[num_failed+1][1]++;
            }
            else {
                pie_data[5][1]++;
            }
        }
    }

    private setHistogramData() {
	let hist_data = this.histogram_ChartData;
        hist_data.push( ['Alumne', 'Aprovades'] );
        
	for (let i in this.studentStats) {
            let student = this.students[i];
            hist_data.push( [student.last_name + ', ' + student.first_name,
			    this.studentStats[i].passed] );
        }
    }

    private setAveragesData() {
	let averages_data = this.averages_ChartData;
        let stats = this.subjectStats;
	let order = this.assessmentOrder;        

        // ...Headers
        let headers = ['Assignatura', 'Mitjana nivell'];
        for (var i = 0; i <= order; i++) {
            headers.push( this.course.assessments[i].name );
        }
        averages_data.push( headers );

        // ...Values
        for (let s in stats[this.course.assessments[0].assessment_id].stats) {
            // Subject id
            let values = [s];

            // Level avg for subject
            values.push( this.levelStats[s].avg );

            // Assessment avg for subject
            for (var i=0; i<=order; i++) {
                let a_id = this.course.assessments[i].assessment_id;
                values.push( this.subjectStats[a_id].stats[s].avg );
            }

            averages_data.push( values );
        }
    }

    private setRatiosData() {
        let ratios_data = this.ratios_ChartData;
        let stats = this.subjectStats; 
        let order = this.assessmentOrder;

        // ...Headers
        let headers = ['Assignatura', 'Ratio nivell'];
        for (var i = 0; i <= order; i++) {
            headers.push( this.course.assessments[i].name );
        }
        ratios_data.push( headers );

        // ...Values
        for (let s in stats[this.course.assessments[0].assessment_id].stats) {
            // Subject id
            let values = [s];

            // Level ratio for subject
            values.push( this.levelStats[s].ratio );

            // Assessment ratio for subject
            for (var i=0; i<=order; i++) {
                let a_id = this.course.assessments[i].assessment_id;
                values.push( this.subjectStats[a_id].stats[s].ratio );
            }

            ratios_data.push( values );
        }
    }
    */
}

