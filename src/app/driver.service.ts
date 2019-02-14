import { Injectable } from '@angular/core';
import { ApiService } from './core/services/api.service';
// import { HttpClient } from '@angular/common/http';
// import {Router} from "@angular/router";
@Injectable({
	providedIn: 'root'
})
export class DriverService {
	constructor(
		public api: ApiService
	) { }

	getProfileDetails(userId) {
		return this.api.get('userDetail/v1/' + userId);
	}

	addDrivers(params) {
		return this.api.post('web/supplier/user/v1/signup', params);
	}

	addDriver(params) {
		return this.api.post('web/supplier/user/v1/type/signup', params);
	}

	editDriver(params) {
		return this.api.post('user/v2/update', params);
	}

	deleteDriver(taxiId) {
		return this.api.get('admin/taxi/v1/delete/' + taxiId);
	}

	getTaxiDetails(taxiId) {
		return this.api.get('taxi/v1/details/' + taxiId);
	}

	getDriverDetails(driverId) {
		return this.api.get('user/v1/get/setting/' + driverId);
	}

	updateVehicleInfo(data) {
		return this.api.post('taxi/v1/updateInfo', data);
	}
	updateProfile(data){
		return this.api.post('user/v2/update', data);
	}
	topup(data){
		return this.api.post('driverBilling/v1/create', data);
	}
}














