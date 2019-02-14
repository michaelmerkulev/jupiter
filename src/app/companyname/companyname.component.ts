import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SidebarService } from '../sidebar.service';
import { AppConfig } from '../config/app.config';
import { ToasterService } from '../../../node_modules/angular2-toaster';
import { SearchService } from '../search/search.service';

@Component({
  selector: 'app-companyname',
  templateUrl: './companyname.component.html',
  styleUrls: ['./companyname.component.css']
})
export class CompanynameComponent implements OnInit {
  output: any;
  outputMessage: any;
  response: any;
  outputdata: any;

  constructor(
	public sidebar: SidebarService,
	private http: HttpClient,
	private router: Router,
	public toasterService: ToasterService,
  public searchService: SearchService) { }

  ngOnInit() {

	this.searchService.searchByCompanyName().subscribe(response => {
		console.log(response);

		this.output = response;
		this.outputdata = this.output.data;
		if (this.output.status === true) {
			this.router.navigate(['companyname']);
		} else {
			this.outputMessage = 'companyname success';
		}
		}, err => {
		console.log(err);
		});
	this.sidebar.show();

  }

}
