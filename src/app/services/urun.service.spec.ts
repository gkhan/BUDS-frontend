import { TestBed } from '@angular/core/testing';

import { UrunService } from './urun.service';

describe('UrunService', () => {
  let service: UrunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
