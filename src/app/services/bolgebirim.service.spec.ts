import { TestBed } from '@angular/core/testing';

import { BolgebirimService } from './bolgebirim.service';

describe('BolgebirimService', () => {
  let service: BolgebirimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BolgebirimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
