import { TestBed, inject } from '@angular/core/testing';

import { TaxiService } from './taxi.service';

describe('TaxiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaxiService]
    });
  });

  it('should be created', inject([TaxiService], (service: TaxiService) => {
    expect(service).toBeTruthy();
  }));
});
