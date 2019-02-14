import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.css']
})
export class SearchDetailComponent implements OnInit {
  private route$: Subscription;
  driver: any;
  authorized: any;
  constructor(private router: Router, private route: ActivatedRoute, private searchService: SearchService) {
  this.authorized = localStorage.authorized;
  }

  ngOnInit() {
  this.route$ = this.route.params
  .subscribe(
  (params: Params) => {
  this.driver = this.searchService.getDriverById(params['id']);
  }
  );
  }

  goHome() {
  this.router.navigate(['/search']);
  }
}
