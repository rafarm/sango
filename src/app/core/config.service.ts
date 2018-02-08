import { Injectable } from '@angular/core';

/*
 * Configuration service.
 *
 * Put your custom configuration here.
 */
@Injectable()
export class ConfigService {

    // Change these values...
    private _backendUrl = 'https://192.168.1.105/api/';
    get backendUrl(): string {
	return this._backendUrl;
    }

    private _schoolName = 'IES Gilabert de Centelles';
    get schoolName(): string {
	return this._schoolName;
    }
}
