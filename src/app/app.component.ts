import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SidebarService } from './sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ToasterConfig } from '../../node_modules/angular2-toaster';
import { EventsService } from './core/services/events.service';
import { SearchService } from './search/search.service';
import { GlobalService } from './global.service';

// import {Router} from "@angular/router";
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	isCollapsed = true;
	toasterConfig: any;
	toasterconfig: ToasterConfig = new ToasterConfig({
		positionClass: 'toast-bottom-right'
	});

	imagePath = '../assets/img/flag/united-kingdom-flag-icon.png';
	users: any[];
	errorMessage: string;
	authorized;
	role;
	path = '../assets/img/flag/';
	modifiedRoleName: any;
	show = false;
	user_role = '';

	constructor(
		public http: HttpClient,
		public sidebar: SidebarService,
		private translate: TranslateService,
		private router: Router,
		public eventsService: EventsService,
		private searchService: SearchService,
		public global: GlobalService
	) {

		translate.setDefaultLang('en');

		this.authorized = localStorage.getItem('authorized');
		
		this.eventsService.on('role', () => {
			this.role = localStorage.getItem('role');
			if (this.role) {
				this.modifiedRoleName = this.role.slice(5);
				switch (this.role) {
          case 'ROLE_SUPPLIER': this.user_role = 'SUPPLIER'; break;
          case 'ROLE_ADMIN': this.user_role = 'ADMIN'; break;
          case 'ROLE_USER': this.user_role = 'USER'; break;
          case 'ROLE_DRIVER': this.user_role = 'DRIVER'; break;
        }
			}
		});

		this.global.componentLoaded.subscribe(data => {
			this.global.isCollapsed = true;
			this.ngOnInit();
		});
	}
	
	goToSearch() {
		this.show = true;
	}

	goToDashboard() {

		this.router.navigate(['dashboard']);
	}

	ngOnInit() {
		this.isCollapsed = this.global.isCollapsed;
		this.eventsService.on('logout', () => {
			this.authorized = false;
			this.user_role = '';
		});
		this.eventsService.on('signUp', () => {
			this.authorized = true;
		});

		this.eventsService.on('signIn', () => {
			this.authorized = true;
		});
	}

	switchLanguage(language: string) {
		switch (language) {
			case 'en': this.imagePath = `${this.path}united-kingdom-flag-icon.png`; break;
			case 'gr': this.imagePath = `${this.path}germany-flag-icon.png`; break;
			case 'fr': this.imagePath = `${this.path}france-flag-icon.png`; break;
			case 'it': this.imagePath = `${this.path}italy-flag-icon.png`; break;
			default: break;
		}
		this.translate.use(language);
	}

	logout() {
		localStorage.clear();
		this.searchService.clearResultData();
		this.modifiedRoleName = null;
		this.eventsService.broadcast('logout');
		this.router.navigate(['/login']);
	}
}
