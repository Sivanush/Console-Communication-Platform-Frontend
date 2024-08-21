import { TestBed } from '@angular/core/testing';

import { FriendSidebarToggleService } from './friend-sidebar-toggle.service';

describe('FriendSidebarToggleService', () => {
  let service: FriendSidebarToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendSidebarToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
