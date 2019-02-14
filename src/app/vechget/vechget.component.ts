import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SidebarService } from '../sidebar.service'

@Component({
  selector: 'app-vechget',
  templateUrl: './vechget.component.html',
  styleUrls: ['./vechget.component.css']
})
export class VechgetComponent implements OnInit {
  output: any;
  outputMessage: any;
  response: any;
  outputdata: any;

  constructor(public sidebar: SidebarService, private http: HttpClient, private router: Router ) { }

  ngOnInit() {
   this.http.get('https://1-dot-taxi2deal.appspot.com/app/ride/v1/user/get/5423601066967040 ')
  .subscribe(response =>  {console.log(response );
  this.output = response;
  this.outputdata = this.output.data;
  if (this.output.status === true) {
  this.router.navigate(['vechget']);
   } else {
   this.outputMessage = 'NO driver in under list Please add driver!!';
   }
  }, err => {
   console.log(err);
  } );
  this.sidebar.show(); }}
