import { Injectable } from '@angular/core';
//import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

declare var EventSource: any;

@Injectable()
export class IngestService {
    private apiUrl = 'http://localhost:3000/api/';

    //constructor(private http: Http) {}

    /*
     * uploadFile
     *
     * Uploads a file to server.
     */
    uploadFile(file: File): Observable<any> {
        let request = new Observable((observer: Observer<any>) => {
            let formData = new FormData();
            let xhr = new XMLHttpRequest();

            formData.append('upload', file, file.name);

            xhr.upload.onprogress = (event: ProgressEvent) => {
                if (event.lengthComputable) {
                    let completed = event.loaded / event.total * 100;
                    observer.next(completed);
                }
                else {
                    observer.next("Uploading...");
                }
            };

            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let name = xhr.response; // Uploaded file name on server returned.

                        let evtSource = new EventSource(this.apiUrl+'ingest/'+name);
                        
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
                    }
                    else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.open('POST', this.apiUrl+'ingest', true);
            xhr.send(formData);
        });

        return request;
    }
}

