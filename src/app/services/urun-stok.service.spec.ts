import { TestBed } from '@angular/core/testing';

import { UrunStokService } from './urun-stok.service';

describe('UrunStokService', () => {
  let service: UrunStokService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrunStokService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
