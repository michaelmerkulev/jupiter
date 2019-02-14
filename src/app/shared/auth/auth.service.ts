import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../config/app.config';
import { ApiService } from '../../core/services/api.service';


@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(private http: HttpClient, public api: ApiService) { }

	signinUser(email: string, password: string, role: string, website: string) {
		const parameters = {
			'address': 'string',
			'carType': 'string',
			'code': 'string',
			'deviceId': 'string',
			'email': email,
			'firstName': 'string',
			'hourly': 0,
			'id': 0,
			'imageInfo': {
				'blobkey': 'string',
				'fileName': 'string',
				'imageUrl': 'string'
			},
			'isSocialUser': true,
			'lang': 'string',
			'lastName': 'string',
			'latitude': 0,
			'licenseNumber': 'string',
			'loginStatus': 'string',
			'longitude': 0,
			'notification': 'string',
			'password': password,
			'phoneNumber': 'string',
			'phoneVerified': 'string',
			'push': 'string',
			'restKey': 'string',
			'role': role,
			'socialUser': true,
			'status': 'string',
			'website': website
		};
		//    return this.http.post(AppConfig.signinURL, parameters);

		return this.api.post('user/v1/type/login', parameters);
	}

	getToken() {
		return localStorage.getItem('token');
	}

	forgot(email) {
		return this.api.get('user/v1/forgotpassword/retrieve/' + email);
	}
}
