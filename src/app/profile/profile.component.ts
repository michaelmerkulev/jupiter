import { Component, OnInit, Input } from '@angular/core';
import { SidebarService } from '../sidebar.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../config/app.config';
import { DriverService } from '../driver.service';
import { EventsService } from '../core/services/events.service';
import { ToasterService } from 'angular2-toaster';
import { GlobalService } from '../global.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	imageUrl: any;
	filename: any;
	photo: any;
	imageBaseURL: any;

	public edited = false;
	public driverData = true;

	user = {
		email: '',
		password: '',
		firstName: '',
		carType: '',
		lastName: '',
		licenseNumber: '',
		phoneNumber: '',
		address: '',
		cityCode: '',
		website: '',
		imageUrl: ' ',
		blobkey: ' ',
		fileName: ' ',
		output: '',
		outputMessage: '',
	};

	id: number;
	userId;
	supplierId;
	add: boolean = false;
	myProfile: any;
	output: any;
	role;

	constructor(
		private router: Router,
		public sidebar: SidebarService,
		private Driver: DriverService,
		private http: HttpClient,
		private eventsService: EventsService,
		public toasterService: ToasterService,
		public global: GlobalService
	) {
		this.userId = localStorage.getItem('userId');
		this.role = localStorage.getItem('role');
		this.getMyProfile();
	}

	ngOnInit() {
		if(this.role == null) this.router.navigate(['login'])
		this.sidebar.show();
		//this.navbar.isCollapsed = false;
		this.global.isCollapsed = false;
		
	}
	ngAfterViewInit(){
		this.global.emit();
	}
	loadImageFileAsURL(event) {
		// get the file name
		this.filename = this.photo.replace(/^.*[\\\/]/, '');

		// converting to base64url
		if (this.photo.length > 0) {
			const fileToLoad = event.srcElement.files[0];
			const fileReader = new FileReader();
			fileReader.onload = (fileLoadedEvent: any) => {
				console.log('>>>>>>>ed', fileLoadedEvent);
				// Base64Url
				this.imageBaseURL = fileLoadedEvent.target.result;

			};
			fileReader.readAsDataURL(fileToLoad);
		}
	}

	uploadImage() {

		const params = {
			'blobkey': 'string',
			'fileName': this.filename,
			'imageUrl': this.imageBaseURL
		};

		this.http.post(AppConfig.base_url + 'taxi/uploadurl', params).subscribe(res => {
			console.log('>>', res);
			this.toasterService.pop('success', 'Success', 'Image uploaded successfully.');
		}, err => {
			console.log('>>Err', err);
			this.toasterService.pop('error', 'Error', 'Something went wrong. We are looking into it.');
		});
	}

	getMyProfile() {
		this.eventsService.broadcast('loader:show');
		this.Driver.getProfileDetails(this.userId).subscribe((res: any) => {
			this.myProfile = res;
			this.user.firstName = this.myProfile.firstName;
			this.user.lastName = this.myProfile.lastName;
			this.user.email = this.myProfile.email;
			this.user.address = this.myProfile.address;
			this.user.phoneNumber = this.myProfile.phoneNumber;
			this.user.website = this.myProfile.website;
			this.user.imageUrl = this.myProfile.imageInfo.imageUrl;
			this.user.fileName = this.myProfile.imageInfo.fileName;
			this.user.blobkey = this.myProfile.imageInfo.blobkey;

			this.eventsService.broadcast('loader:hide');
		}, err => {
			this.eventsService.broadcast('loader:hide');
		});
	}

	getProfileDetails() {
		this.eventsService.broadcast('loader:show');
		this.Driver.getProfileDetails(this.userId).subscribe((res: any) => {
			this.myProfile = res.data;
			console.log(this.myProfile);
			this.eventsService.broadcast('loader:hide');
		}, err => {
			this.eventsService.broadcast('loader:hide');
		});
	}

	addDriver() {
		this.add = true;
		this.edited = true;
		this.driverData = false;
	}

	cancel() {
		this.add = false;
		this.edited = false;
	}

	editProfile() {
		this.Driver.editDriver(this.user).subscribe((res: any) => {
			console.log('Driver >>> ', res);
			this.user = res.data;
			this.edited = true;
			this.add = false;
		}, err => {
			console.log(err);
		});
	}

	addUpdateProfile(type) {

		const parameters = {
			'address': this.user.address,
			'carType': this.user.carType,
			'code': this.user.cityCode,
			'deviceId': 'string',
			'email': this.user.email,
			'firstName': this.user.firstName,
			'hourly': 0,
			'id': this.myProfile.id,
			'imageInfo': {
				'blobkey': this.user.blobkey,
				'fileName': this.user.fileName,
				'imageUrl': this.user.imageUrl,
			},
			'isSocialUser': true,
			'lang': 'string',
			'lastName': this.user.lastName,
			'latitude': 0,
			'licenseNumber': 'string',
			'loginStatus': 'string',
			'longitude': 0,
			'notification': 'string',
			'password': this.user.password,
			'phoneNumber': this.user.phoneNumber,
			'phoneVerified': 'string',
			'push': 'string',
			'restKey': 'string',
			'role': this.myProfile.role,
			'socialUser': true,
			'status': 'string',
			'website': this.user.website
		};
		this.eventsService.broadcast('loader:show');
		if (type === 'add') {
			this.Driver.editDriver(parameters).subscribe(res => {
				this.eventsService.broadcast('loader:hide');
				this.toasterService.pop('success', 'Success', 'Added Successfully.');
				this.edited = false;
				this.getMyProfile();
				this.clearDriverForm();
			}, err => {
				this.eventsService.broadcast('loader:hide');
				this.toasterService.pop('error', 'Error', 'Something went wrong.');
			});
		} else {
			this.Driver.updateProfile(parameters).subscribe(res => {

				this.toasterService.pop('success', 'Success', 'Driver Details Updated Successfully.');
				this.edited = false;
				this.getMyProfile();
				this.eventsService.broadcast('loader:hide');
				this.clearDriverForm();
			}, err => {
				this.eventsService.broadcast('loader:hide');
				this.toasterService.pop('error', 'Error', 'Something went wrong.');
			});
		}
	}

	clearDriverForm() {
		this.user.firstName = '';
		this.user.lastName = '';
		this.user.email = '';
		this.user.password = '';
		this.user.phoneNumber = '';
		this.user.address = '';
		this.user.cityCode = '';
		this.user.carType = '';
		this.user.imageUrl = ' ';
			}

	removeTaxi(taxi) {
		if (confirm('Are you sure you want to remove this driver?')) {
			this.eventsService.broadcast('loader:show');
			this.Driver.deleteDriver(taxi.id).subscribe(res => {
				this.getMyProfile();
				this.eventsService.broadcast('loader:hide');
				this.toasterService.pop('success', 'Success', 'Deleted Successfully.');
			}, err => {
				this.eventsService.broadcast('loader:hide');
				this.toasterService.pop('error', 'Error', 'Something went wrong.');
			});
		}
	}
}

