import { AfterViewInit, Component } 	from '@angular/core';

import { IngestService } 		from './ingest.service';

@Component({
    moduleId: module.id,
    templateUrl: './ingest.component.html',
    styleUrls: ['./ingest.component.css'],
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

    private state: string;
    private fileToUpload: File;
    private progress_value: number;
    private progress_msg: string;
    private progress_bar: any = null;
    private alert_title: string;
    private alert_msg: string;

    constructor(private ingestService: IngestService) {}

    ngAfterViewInit() {
	this.progress_bar = document.querySelector(".progress-bar");
	this.state = this.IngestState.NONE;
    }

    fileChangeEvent(event: any) {
	this.fileToUpload = event.target.files[0];
	this.state = this.IngestState.SELECT;
    }

    upload() {
	this.progress_value = 0;
	this.progress_msg = '0%';
	this.state = this.IngestState.UPLOAD;

	this.show_progress();

	this.ingestService.ingestFile(this.fileToUpload)
	    .subscribe(
		(value: string) => this.process_progress(value),
		(error: string) => this.process_error(error),
		() => this.process_finished()
	    );
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

        this.show_progress();
    }

    process_error(error: string) {
	this.alert_title = "Error!";
	this.alert_msg = error;

	this.state = this.IngestState.ERROR;
	
    }

   process_finished() {
	this.alert_title = "Success!";
        this.alert_msg = "File processed without errors.";

        this.state = this.IngestState.SUCCESS;
    }

    show_progress() {
        this.progress_bar.style.width = this.progress_value + '%';
        this.progress_bar.innerHTML = this.progress_msg;
        this.progress_bar.setAttribute('aria-valuenow', this.progress_value);

	if (this.state == this.IngestState.PROCESS) {
            this.progress_bar.classList.add('progress-bar-striped');
            this.progress_bar.classList.add('progress-bar-animated');
	}
	else {
            this.progress_bar.classList.remove('progress-bar-striped');
            this.progress_bar.classList.remove('progress-bar-animated');
	}
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

        let classes = {
            'show': show
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
