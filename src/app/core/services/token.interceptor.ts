import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

	constructor(private injector: Injector, private router: Router) {
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		const token = localStorage.getItem('token');
		if (token && token !== 'null') {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`
				}
			});
		}

		return next.handle(request).do((event: HttpEvent<any>) => {

		}, (err: any) => {
			if (err instanceof HttpErrorResponse) {
				if (err.status === 401) {
					this.router.navigate(['/login']);
				}
			}
		});
	}
}
