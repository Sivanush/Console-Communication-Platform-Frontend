import { TestBed } from '@angular/core/testing';

import { DirectCallService } from './direct-call.service';

describe('DirectCallService', () => {
  let service: DirectCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
