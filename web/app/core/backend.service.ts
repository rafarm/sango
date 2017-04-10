import { Injectable } 		from '@angular/core';
import { Http, Response }	from '@angular/http';
import { Observable } 		from 'rxjs/Observable';
import { Observer } 		from 'rxjs/Observer';

import 'rxjs/add/observable/throw';

import { ConfigService }	from './config.service';

declare var EventSource: any;

// TODO: Change this class' name, PLEASE!
export class CallData {
    constructor(
	public state: number,
	public status: number,
	public data: string
    ) {};
}

@Injectable()
export class BackendService {
    private backendUrl: string;

    constructor(
	private configService: ConfigService,
	private http: Http
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
	    .catch(this.handleError);
    }

    /*
     * uploadFile
     *
     * Uploads a file to server.
     */
    uploadFile(file: File): Observable<CallData> {
        let request = Observable.create((observer: Observer<CallData>) => {
            let formData = new FormData();
            let xhr = new XMLHttpRequest();

            formData.append('upload', file, file.name);

            xhr.upload.onprogress = (event: ProgressEvent) => {
		let msg = 'Uploading...';
                if (event.lengthComputable) {
                    let completed = event.loaded / event.total * 100;
		    msg = ""+completed;
                }

                observer.next(new CallData(xhr.readyState, xhr.status, msg));
            };

            xhr.onreadystatechange = () => {
		observer.next(new CallData(xhr.readyState, xhr.status, xhr.response));
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
    private extractData(res: Response) {
	let body = res.json();
	return body.data || { };
    }

    /* handleError
     *
     * General error handling.
     */
    private handleError (error: Response | any): Observable {
	let errMsg: string;
	if (error instanceof Response) {
	    const body = error.json() || '';
	    const err = body.error || JSON.stringify(body);
	    errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
	}
	else {
	    errMsg = error.message ? error.message : error.toString();
	}
    
	console.error(errMsg);
	return Observable.throw(errMsg);
  }
}

