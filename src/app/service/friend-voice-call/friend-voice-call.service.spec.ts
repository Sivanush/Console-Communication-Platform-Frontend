import { TestBed } from '@angular/core/testing';

import { FriendVoiceCallService } from './friend-voice-call.service';

describe('FriendVoiceCallService', () => {
  let service: FriendVoiceCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendVoiceCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
