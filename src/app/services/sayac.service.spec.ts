import { TestBed } from '@angular/core/testing';

import { SayacService } from './sayac.service';

describe('SayacService', () => {
  let service: SayacService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SayacService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
