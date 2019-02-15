import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SidebarService } from '../sidebar.service';
import { AuthService } from '../shared/auth/auth.service';
import { ToasterService } from '../../../node_modules/angular2-toaster';
import { EventsService } from '../core/services/events.service';
import { ApiService } from '../core/services/api.service';
import { ValidationErrors } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	Password: string;
	Email: string;
	Role: string;
	output: any;
	outputMessage: string;
	forgotPwdDiv: any;
	loginForm: any;
	outputdata: any;
	email: String;
	data: any;

	public showMenu = false;
	hide: boolean;
	website: any;

	signInForm: FormGroup;

	submitted = false;

	constructor(
		private router: Router,
		public sidebar: SidebarService,
		private http: HttpClient,
		private auth: AuthService,
		public toasterService: ToasterService,
		public apisevice: ApiService,
		public eventsService: EventsService,
		private formBuilder: FormBuilder) {
			if (localStorage.getItem('userId')) {
				switch (localStorage.getItem('role')) {
					case 'ROLE_DRIVER':
						this.eventsService.broadcast('refreshMenu:driver');
						this.router.navigate(['profile']);
						break;
					case 'ROLE_USER':
						this.eventsService.broadcast('refreshMenu:user');
						this.router.navigate(['trip']);
						break;
					case 'ROLE_ADMIN':
						this.eventsService.broadcast('refreshMenu:admin');
						this.router.navigate(['dashboard']);
						break;
					case 'ROLE_SUPPLIER':
						this.eventsService.broadcast('refreshMenu:supplier');
						this.router.navigate(['approval']);
						break;
				}
			}
		}

	ngOnInit() {
		this.sidebar.hide();
		this.loginForm = true;
		this.forgotPwdDiv = false;
		this.Email = '';
		this.Password = '';
		this.signInForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.%+-]+\\.[a-z]{2,4}$')]],
			password: ['', Validators.required],
			role: ['', Validators.required],
      website: ['', Validators.required]
    });
	}

	// convenience getter for easy access to form fields
	get f() { return this.signInForm.controls; }

	forgotPwd() {
		this.loginForm = false;
		this.forgotPwdDiv = true;
	}

	signin() {
		this.loginForm = true;
		this.forgotPwdDiv = false;
	}

	onChange(value) {
		if (value === 'ROLE_USER' || value === 'ROLE_ADMIN') {
			this.hide = false;
		} else {
			this.hide = true;
		}
	}
	loginUser() {
		this.submitted = true;
        // stop here if form is invalid
    if (this.hide && this.signInForm.invalid) { return; }
    if (!this.hide && (this.signInForm.controls.email.invalid || this.signInForm.controls.role.invalid || this.signInForm.controls.password.invalid)) return;
		
		this.eventsService.broadcast('loader:show');
		this.auth.signinUser(this.signInForm.controls['email'].value, this.signInForm.controls['password'].value, this.signInForm.controls['role'].value, this.website).subscribe(
			(response: any) => {

				this.eventsService.broadcast('loader:hide');
				this.output = response;
				this.data = response.data;

				if (this.output.status === true) {
					this.eventsService.broadcast('signIn');

					localStorage.clear();
					localStorage.setItem('authorized', 'true');
					localStorage.setItem('token', this.output.jwt);
					localStorage.setItem('role', this.output.data.role);
					localStorage.setItem('supplierId', this.output.data.supplierId);
					localStorage.setItem('userId', this.output.data.userId);
					if (this.output.data.taxiId) {
						localStorage.setItem('taxiId', this.output.data.taxiId);
					}

					this.eventsService.broadcast('role');

					switch (this.output.data.role) {
						case 'ROLE_DRIVER':
							this.eventsService.broadcast('refreshMenu:driver');
							//this.router.navigate(['profile']);
							this.toasterService.pop('success', this.output.message);
							break;
						case 'ROLE_USER':
							this.eventsService.broadcast('refreshMenu:user');
							//this.router.navigate(['profile']);
							this.toasterService.pop('success', this.output.message);
							break;
						case 'ROLE_ADMIN':
							this.eventsService.broadcast('refreshMenu:admin');
							//this.router.navigate(['dashboard']);
							this.toasterService.pop('success', this.output.message);
							break;
						case 'ROLE_SUPPLIER':
							this.eventsService.broadcast('refreshMenu:supplier');
							//this.router.navigate(['approval']);
							this.toasterService.pop('success', this.output.message);
							break;
					}
					this.router.navigate(['dashboard']);
				} else {
					this.toasterService.pop('error', 'Error', this.output.message);
				}
			},
			err => {
				this.eventsService.broadcast('loader:hide');
				this.toasterService.pop('error', 'Error', 'Something went wrong.');
			}
		);
	}

	forgotPass() {
		let Email = this.email;
			this.http.get(`http://1-dot-taxi2dealin.appspot.com/app/user/v1/forgotpassword/retrieve/${Email}`).subscribe((response: any) => {
			console.log(response);
			this.output = response;
			this.data = response.data;
			if (this.output.status === true) {
			this.toasterService.pop('success', this.output.message);
			this.router.navigate(['/login']);
			}
		},
			err => {
				console.log(err);
				this.toasterService.pop('error', this.output.message);
			});
	}
}
