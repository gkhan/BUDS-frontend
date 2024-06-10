import { TestBed } from '@angular/core/testing';

import { StokKabulService } from './stok-kabul.service';

describe('StokKabulService', () => {
  let service: StokKabulService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StokKabulService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
