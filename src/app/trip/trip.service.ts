import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../config/app.config';
import { ApiService } from '../core/services/api.service';

@Injectable({
	providedIn: 'root'
})
export class TripService {
	trips: any;
	constructor(private http: HttpClient, private api: ApiService) { }
	getTrips() {
		let url = '';
		let role = localStorage.getItem('role');
		if (role === 'ROLE_DRIVER') {
			url = 'ride/v1/driver/get/' + localStorage.getItem('userId');
		} else {
			url = 'ride/v1/user/get/' + localStorage.getItem('userId');
		}
		return this.api.get(url);
	}
	setTrips(data) {
		this.trips = data;
	}

	getDriver(driverId) {
		return this.api.get('ride/v1/driver/get/' + driverId);
	}

	getTripById(id) {
		if (this.trips) {
			return this.trips.find(trip => trip.id === id);
		} else {
			return [];
		}
	}
}
