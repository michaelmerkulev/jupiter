import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../config/app.config';
import { ApiService } from '../core/services/api.service';

@Injectable({
	providedIn: 'root'
})

export class SearchService {
	resultData: any = [];
	constructor(
		private http: HttpClient,
		public api: ApiService) { }

	httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${localStorage.getItem('token')}`
		})
	};

	search(destination: string, id: string, latitude: number, longitude: number, source: string, type: string) {
		const param = {
			'destination': 'string',
			'distance': 0,
			'id': 0,
			'km': 0,
			'latitude': latitude,
			'longitude': longitude,
			'radius': 0,
			'source': 'string',
			'type': 'string'
		};
		return this.api.post('taxi/v1/search/auto/ByGeoLocation', param).map(response => {
			return response['data'];
		});
	}

	setResultData(result) {
		this.resultData = result;
	}

	getResultData() {
		return this.resultData;
	}

	clearResultData() {
		this.resultData = [];
	}

	getDriverById(id) {
		if (this.resultData) {
			return this.resultData.find(driver => driver.id === id);
		} else {
			return [];
		}
	}

	getTaxiDetails(taxiId, driverId) {
		return this.api.get('taxi/v1/detailview/' + taxiId + '/' + driverId);
	}

	postReview(data) {
		return this.api.post('review/v1/create', data);
	}

	getReview(taxiDetailId) {
		return this.api.get('review/v1/ByTaxiDetailId/' + taxiDetailId);
	}

	postContactForm(data) {
		return this.api.post('contactus/mail/create', data);
	}

	getvechicle(taxiId) {
		return this.api.get('taxi/v1/details/' + taxiId );
	}

	// postSignUp(data) {
	//   return this.api.post('/supplier/user/v1/type/signup', data);
	// }

	taxiPositionData(supplierId, userID) {
		return this.api.get('taxi/v1/mytaxies/' + supplierId + '/' + userID);
	}

	taxiApproves(supId, userId) {
		if ( supId === 0 || supId === '0') {
			return this.api.get('taxi/v1/approves/' + userId);
		} else {
			return this.api.get('taxi/v1/mytaxies/approve/' + supId + '/' + userId);
		}
	}

	searchByCompanyName() {
		return this.api.get('taxi/v1/searchByName/bbbb');
	}
}
