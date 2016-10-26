import { Component } from '@angular/core';

import { DataService } from './data.service';

@Component({
	selector: 'dashboard',
	templateUrl: 'app/dashboard.component.html'
})
export class DashboardComponent {
    private fileToUpload: File;
    private response: any;

    constructor(private dataService: DataService) {}

    fileChangeEvent(event: any) {
	this.fileToUpload = event.target.files[0];
    }

    upload() {
	this.dataService.uploadFile(this.fileToUpload)
	    .then(response => this.response = response);
    }
}
