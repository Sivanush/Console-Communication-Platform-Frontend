import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityVideoChatComponent } from './community-video-chat.component';

describe('CommunityVideoChatComponent', () => {
  let component: CommunityVideoChatComponent;
  let fixture: ComponentFixture<CommunityVideoChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityVideoChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommunityVideoChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
