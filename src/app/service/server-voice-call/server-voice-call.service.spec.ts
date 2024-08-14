import { TestBed } from '@angular/core/testing';

import { ServerVoiceCallService } from './server-voice-call.service';

describe('ServerVoiceCallService', () => {
  let service: ServerVoiceCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerVoiceCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
