import { Injectable } 		from '@angular/core';
import { HttpClient,
	 HttpErrorResponse }	from '@angular/common/http';
import { Observable } 		from 'rxjs/Observable';
import { Observer } 		from 'rxjs/Observer';
import { MatDialog }		from '@angular/material/dialog';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/catch';

import { ConfigService }		from './config.service';
import { ConfirmDialogComponent }	from '../utils/confirm-dialog.component';

declare var EventSource: any;

export class UploadProgress {
    constructor(
	public state: number,
	public status: number,
	public data: string
    ) {};
}


@Injectable()
export class BackendService {
    private backendUrl: string;
    private errorDialogShown: boolean = false;
    private retryCount: number = 0;

    constructor(
	public dialog: MatDialog,
	private configService: ConfigService,
	private http: HttpClient
    ) {
	this.backendUrl = configService.backendUrl;
    }

    /* get
     *
     * Backend get call.
     */
    get(call: string): Observable<any> {
	return this.http.get(this.backendUrl + call)
	    .map(this.extractData)
	    .retryWhen(errors => this.checkUnauthorized(errors, 3))
	    .catch(error => this.handleError(error));
    }

    /* put
     *
     * Backend put call.
     */
    put(call: string, body: any, options: any): Observable<any> {
        return this.http.put(this.backendUrl + call, body, options)
	    .map(this.extractData)
	    .retryWhen(errors => this.checkUnauthorized(errors, 3))
	    .catch(error => this.handleError(error));
    }

    /*
     * uploadFile
     *
     * Uploads a file to server.
     */
    uploadFile(file: File): Observable<UploadProgress> {
        let request = Observable.create((observer: Observer<UploadProgress>) => {
            let formData = new FormData();
            let xhr = new XMLHttpRequest();

            formData.append('upload', file, file.name);

            xhr.upload.onprogress = (event: ProgressEvent) => {
		let msg = 'Uploading...';
                if (event.lengthComputable) {
                    let completed = event.loaded / event.total * 100;
		    msg = ""+completed;
                }

                observer.next(new UploadProgress(xhr.readyState, xhr.status, msg));
            };

            xhr.onreadystatechange = () => {
		observer.next(new UploadProgress(xhr.readyState, xhr.status, xhr.response));
		if (xhr.readyState == 4) {
		    observer.complete();
		}
            };

            xhr.open('POST', this.backendUrl+'ingest', true);
            xhr.send(formData);
        });

        return request;
    }

    /*
     * processFile
     *
     * Process data file previously uploaded.
     */
    processFile(name: string): Observable<string> {
	let request = Observable.create((observer: Observer<string>) => {
	    let evtSource = new EventSource(this.backendUrl+'ingest/'+name);

            evtSource.onmessage = (e: any) => {
                observer.next(e.data);
            }

            evtSource.addEventListener("end", (e: any) => {
                observer.complete();
                evtSource.close();
            }, false);

            evtSource.addEventListener("error", (e: any) => {
                observer.error(e.data);
                evtSource.close();
            }, false);
        });

        return request;
    }

    /*
     * extractData
     *
     * Extracts json embedded data in backend's response.
     */
    private extractData(res: any) {
	return res['data'] || { };
    }

    /* checkUnauthorized
     *
     * Checks for unauthorized access
     */
    private checkUnauthorized(errors: Observable<HttpErrorResponse>, maxRetries: number): Observable<any> {
	return errors.concatMap(err => {
	    if (err.status == 401 || this.retryCount >= maxRetries) {
		this.retryCount = 0;
		return Observable.throw(err);
	    }
	    
	    this.retryCount++;
	    return Observable.of(true);
	    //return Observable.throw(err);
        });
    }

    /* handleError
     *
     * General error handling.
     */
    private handleError (error: HttpErrorResponse) {
	let errMsg: string = `${error.status} - ${error.message}`;
	let title: string = 'Error de comunicació';
	let content: string = 'Ha hagut un error de comunicació amb el servidor. Per favor, torneu a intentar-ho més tard.';
	let action: () => void = () => {this.errorDialogShown = false};
    
	if (error.status == 401) {
            // Unauthorized access
	    title = 'Accès no autoritzat'
	    content = 'La sessió ha caducat.';
	    action = () => {window.location.href = 'logout';};
        }
	else {
	    if (error.error instanceof ErrorEvent) {
		errMsg = 'Backend error: ' + error.error.message;
	    }
	}

	this.showErrorDialog(title, content).subscribe(action);
    
	return Observable.throw(errMsg);
    }

    private showErrorDialog(title: string, content: string): Observable<boolean> {
	if (!this.errorDialogShown) {
	    this.errorDialogShown = true;
	    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
		closeOnNavigation: true,
		data: {
		    title: title,
		    content: content,
		    cancel: null,
		    action: 'Accepta'
		},
		disableClose: true
	    });
            
	    return dialogRef.afterClosed();
	}
    
	return Observable.of(false);
    }
}

