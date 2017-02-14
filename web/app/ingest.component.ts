import { AfterViewInit, Component } from '@angular/core';

import { DataService } from './data.service';


@Component({
	selector: 'ingest',
	templateUrl: 'app/ingest.component.html'
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

    private state: string;
    private fileToUpload: File;
    private progress_value: number;
    private progress_msg: string;
    private progress_bar: any = null;
    private alert_title: string;
    private alert_msg: string;

    constructor(private dataService: DataService) {}

    ngAfterViewInit() {
	this.progress_bar = document.querySelector(".progress-bar");
	this.state = this.IngestState.NONE;
    }

    fileChangeEvent(event: any) {
	this.fileToUpload = event.target.files[0];
	this.state = this.IngestState.SELECT;
    }

    upload() {
	this.state = this.IngestState.UPLOAD;
	this.progress_value = 0;
	this.progress_msg = '0%';

	this.dataService.uploadFile(this.fileToUpload)
	    .subscribe(
		value => this.process_progress(value),
		error => this.process_error(error),
		() => this.process_finished()
	);
    }

    process_progress(value: any) {
	let parsed_value = Math.floor(value);
	if (isNaN(parsed_value)) {
	    this.progress_value = 100;
	    this.progress_msg = value;

	    this.state = this.IngestState.PROCESS;
	}
	else {
	    this.progress_value = Math.floor(parsed_value);
	    this.progress_msg = this.progress_value + '%';
	}

	this.progress_bar.style.width = this.progress_value + '%';
	this.progress_bar.innerHTML = this.progress_msg;
	this.progress_bar.setAttribute('aria-valuenow', this.progress_value);
    }

    process_error(error: any) {
	this.alert_title = "Error!";
	this.alert_msg = error;

	this.state = this.IngestState.ERROR;
	
    }

   process_finished() {
	this.alert_title = "Success!";
        this.alert_msg = "File processed without errors.";

        this.state = this.IngestState.SUCCESS;
    }

    alert_classes() {
	let show = this.state == this.IngestState.ERROR || this.state == this.IngestState.SUCCESS;
	let danger = this.state == this.IngestState.ERROR;
	let success = this.state == this.IngestState.SUCCESS;

	let classes = {
	    'show'         : show,
	    'alert-danger' : danger,
	    'alert-success': success
	};

	return classes;
    }

    progress_classes() {
        let show = this.state == this.IngestState.UPLOAD || this.state == this.IngestState.PROCESS;
	let striped = this.state == this.IngestState.PROCESS;

        let classes = {
	    'progress-bar-striped' : striped,
	    'progress-bar-animated': striped,
            'show'                 : show
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
