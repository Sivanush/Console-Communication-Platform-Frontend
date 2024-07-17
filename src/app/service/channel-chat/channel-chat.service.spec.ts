import { TestBed } from '@angular/core/testing';

import { ChannelChatService } from './channel-chat.service';

describe('ChannelChatService', () => {
  let service: ChannelChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
