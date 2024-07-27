import { TestBed } from '@angular/core/testing';

import { ServerVideoCallService } from './server-video-call.service';

describe('ServerVideoCallService', () => {
  let service: ServerVideoCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerVideoCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
