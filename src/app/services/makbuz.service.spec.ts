import { TestBed } from '@angular/core/testing';

import { MakbuzService } from './makbuz.service';

describe('MakbuzService', () => {
  let service: MakbuzService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MakbuzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
