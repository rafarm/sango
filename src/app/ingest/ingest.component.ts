import { AfterViewInit, Component, ChangeDetectorRef } 	from '@angular/core';

import { IngestService } from './ingest.service';

@Component({
    templateUrl: './ingest.component.html',
    styleUrls: ['./ingest.component.scss'],
    providers: [ IngestService ]
})
export class IngestComponent implements AfterViewInit {
    IngestState = {
	NONE    : 'none',
	SELECT  : 'select',
	UPLOAD  : 'upload',
	PROCESS : 'process',
	SUCCESS : 'success',
	ERROR   : 'error'
    }

    ProgressBarMode = {
	DETERMINATE   : 'determinate',
	INDETERMINATE : 'indeterminate'
    }

    state: string;
    fileToUpload: File;
    progress_value: number;
    progress_msg: string;
    progress_bar_mode: string;
    alert_title: string;
    alert_msg: string;

    constructor(private cdRef: ChangeDetectorRef, private ingestService: IngestService) {}

    ngAfterViewInit() {
	//this.progress_bar = document.querySelector(".progress-bar");
	this.state = this.IngestState.NONE;
    }

    fileChangeEvent(event: any) {
	this.fileToUpload = event.target.files[0];
	this.state = this.IngestState.SELECT;
	this.reset_alert();
    }

    upload() {
	this.reset_alert();
	this.reset_progress();
	this.state = this.IngestState.UPLOAD;
	this.progress_bar_mode = this.ProgressBarMode.DETERMINATE;

	this.ingestService.ingestFile(this.fileToUpload)
	    .subscribe(
		(value: string) => this.process_progress(value),
		(error: string) => this.process_error(error),
		() => this.process_finished()
	    );
    }

    reset_alert() {
	this.alert_title = null;
	this.alert_msg = null;
    }

    reset_progress() {
	this.progress_value = 0;
	this.progress_msg = null;
    }

    process_progress(value: string) {
	let parsed_value = Math.floor(+value);
	if (isNaN(parsed_value)) {
	    this.progress_value = 100;
	    this.progress_msg = value;

	    this.state = this.IngestState.PROCESS;
	}
	else {
	    this.progress_value = Math.floor(parsed_value);
	    this.progress_msg = this.progress_value + '%';
	}

	this.progress_bar_mode = this.state == this.IngestState.PROCESS ? this.ProgressBarMode.INDETERMINATE : this.ProgressBarMode.DETERMINATE
	this.cdRef.detectChanges();
    }

    process_error(error: string) {
	this.alert_title = "Error!";
	this.alert_msg = error;

	this.state = this.IngestState.ERROR;
    }

   process_finished() {
	this.alert_title = "Correcte!";
        this.alert_msg = "Fitxer processat sense errors.";

        this.state = this.IngestState.SUCCESS;
    }
    
    alert_classes() {
	let show = this.state == this.IngestState.ERROR || this.state == this.IngestState.SUCCESS;
	let danger = this.state == this.IngestState.ERROR;
	let success = this.state == this.IngestState.SUCCESS;

	let classes = {
	    'sg-show'         : show,
	    'sg-alert-danger' : danger,
	    'sg-alert-success': success
	};

	return classes;
    }

    progress_classes() {
        let show = this.state == this.IngestState.UPLOAD || this.state == this.IngestState.PROCESS;

        let classes = {
            'sg-show': show
        };

        return classes;
    }

    filename_field_classes() {
        let disabled = this.state == this.IngestState.UPLOAD || this.state == this.IngestState.PROCESS;

        let classes = {
            'sg-disabled': disabled
        };

        return classes;
    }

    upload_disabled() {
	let disabled: boolean;

	switch (this.state) {
	    case this.IngestState.SELECT:
	    case this.IngestState.ERROR:
	    case this.IngestState.SUCCESS:
		disabled = false;
		break;
	    default:
		disabled = true;
	}

	return disabled;
    }
}
