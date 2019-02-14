import {InjectionToken} from '@angular/core';

import {IAppConfig} from './iapp.config';

export let APP_CONFIG = new InjectionToken('app.config');

export const AppConfig: IAppConfig = {
  base_url: 'https://1-dot-taxi2dealin.appspot.com/app/',
  routes: {
  taxiList: 'taxiList',
  error404: '404'
  },
  endpoints: { taxiList: 'http://1-dot-taxi2deals.appspot.com/app/taxi/v1/mytaxies/5702459250966528' },
  votesLimit: 3,
  topHeroesLimit: 4,
  snackBarDuration: 3000,
  repositoryURL: 'https://github.com/Ismaestro/angular5-example-app',
  signinURL: 'http://1-dot-taxi2deals.appspot.com/app/user/v1/type/login',
  searchURL: 'http://1-dot-taxi2deals.appspot.com/app/taxi/v1/search/auto/ByGeoLocation',
  forgotURL: 'https://2-dot-taxi2dealin.appspot.com/app/user/v1/forgotpassword/retrieve/email',
  tripURL: 'http://1-dot-taxi2deals.appspot.com/app/ride/v1/driver/get/4695469246644224',
  approveURL: 'https://1-dot-taxi2deals.appspot.com/app/taxi/v1/approve',
  signupURL: 'http://1-dot-taxi2deals.appspot.com/app/supplier/user/v1/type/signup',
  profileURL: 'https://2-dot-taxi2dealin.appspot.com//app/userDetail/v1/5692367319334912',
  signupURL1: 'https://2-dot-taxi2dealin.appspot.com/app/web/supplier/user/v1/type/signup'
};
