import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../sidebar.service';
import { EventsService } from '../core/services/events.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

	public showMenu = true;
	roles: any;
	hideMenu: boolean;
	menus: any = [];
	role: string;

	constructor(
		public sidebar: SidebarService,
		public eventsService: EventsService) {
		this.role = localStorage.getItem('role');
	}

	ngOnInit() {

		if (this.role) {
			setTimeout(() => {
				switch (this.role) {
					case 'ROLE_DRIVER':
						this.eventsService.broadcast('refreshMenu:driver');
						break;
					case 'ROLE_USER':
						this.eventsService.broadcast('refreshMenu:user');
						break;
					case 'ROLE_ADMIN':
						this.eventsService.broadcast('refreshMenu:admin');
						break;
					case 'ROLE_SUPPLIER':
						this.eventsService.broadcast('refreshMenu:supplier');
						break;
				}
			}, 1000);
		}

		this.eventsService.on('refreshMenu:driver', () => {
			this.menus = [
				{
					text: 'Profile', link: 'profile'
				},
			/*	{
					text: 'Vechicle', link: 'vechicle'
				},*/
				{
					text: 'Trip', link: 'trip'
				}
			];
		});

		this.eventsService.on('refreshMenu:user', () => {
			this.menus = [
				{
					text: 'Profile', link: 'profile'
				},
				{
					text: 'Trip', link: 'trip'
				}
			];
		});

		this.eventsService.on('refreshMenu:admin', () => {
			this.menus = [
				/*{
					text: 'Driver List', link: 'adminlist'
				},*/
				{
					text: 'Approval', link: 'approval'
				},
				{
					text: 'Dashboard', link: 'dashboard'
				},
				{
					text: 'Admins', link: 'adminlist'
				}
			];
		});

		this.eventsService.on('refreshMenu:supplier', () => {
			this.menus = [
				{
					text: 'Dashboard', link: 'dashboard'
				},
				{
					text: 'Profile', link: 'profile'
				},
				{
					text: 'Search', link: 'search'
				},
				{
					text: 'Driver', link: 'driverdetail'
				},
				{
					text: 'Approval', link: 'approval'
				},
				{
					text: 'Driver TOPUP', link: 'drivertopup'
				},
				{
					text: 'Map', link: 'map'
				}
			];
		});

	}
	// tslint:disable-next-line:use-life-cycle-interface
	ngOnDestroy () {
		// this.role = false;
	}

	getAsyncData() {
	}

}
