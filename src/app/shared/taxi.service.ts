import { Observable, of, throwError as observableThrowError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../config/app.config';
import { LoggerService } from '../core/services/logger.service';
import { catchError, tap } from 'rxjs/operators';
import { TaxiView } from './taxiview.model';
// import { map, take } from 'rxjs/operators';
import 'rxjs/Rx';
import { ApiService } from '../core/services/api.service';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
	providedIn: 'root'
})
export class TaxiService {
	resultData: any = [];

	taxiUrl: string;
	approveUrl: string;
	output: any;
	outputdata: any;
	response: any;
	userId: any;
	supplierId: any;
	outputMessage: string;


	constructor(private http: HttpClient, private api: ApiService) {
		this.taxiUrl = AppConfig.endpoints.taxiList;
		this.approveUrl = AppConfig.approveURL;
	}

	private static handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// TODO: better job of transforming error for user consumption
			LoggerService.log(`${operation} failed: ${error.message}`);
			if (error.status >= 500) {
				throw error;
			}
			return of(result as T);
		};
	}

	getTaxiViews(): Observable<TaxiView[]> {
		return this.http.get<TaxiView[]>(this.taxiUrl).pipe(tap(() => LoggerService.log(`fetched heroes`)),
			catchError(TaxiService.handleError('getHeroes', [])));
	}

	getTaxiDetailsById(id: string): Observable<TaxiView> {
		const url = `${this.taxiUrl}/${id}`;
		return this.http.get<TaxiView>(url).pipe(
			tap(() => LoggerService.log(`fetched hero id=${id}`)),
			catchError(TaxiService.handleError<TaxiView>(`getHero id=${id}`))
		);
	}

	getApproved2(id: string, userId: string) {
		console.log('-->' + userId + ' id-->' + id);

		const url = `${this.approveUrl}/${id}/${userId}`;

		console.log(url);
		return this.http.get<TaxiView>(url).pipe(
			tap(() => LoggerService.log(`fetched hero id=${id}`)),
			catchError(TaxiService.handleError<TaxiView>(`getHero id=${id}`))
		);
	}

	getApproved(id: string, userId: string) {
		return this.api.get(AppConfig.base_url + 'taxi/v1/approve/' + id + '/' + userId);
	}

	getApprovedTest2(id: string, userId: string) {
		const supplierId = localStorage.supplierId;
		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			})
		};
		const url = `${this.approveUrl}/${id}/${userId}`; return this.http.get(url, httpOptions).map(response => {
			return response['data'];
		});
	}

	// getTradeObservable(id: string): Observable<any> {
	//   const url = `${this.taxiUrl}/${id}`;
	//   return this.http.get(this.taxiUrl)
	//     .map(this.extractData)
	//     .catch(TaxiService.handleError);
	// }

	// private extractData(res: Response) {
	//   let body = res.json();
	//   console.log("body:" + body);
	//   console.log("Entire Body.trades: " + body.data);
	//   return body.trades;
	// }

}
