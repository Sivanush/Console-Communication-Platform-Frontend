import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityAudioChatComponent } from './community-audio-chat.component';

describe('CommunityAudioChatComponent', () => {
  let component: CommunityAudioChatComponent;
  let fixture: ComponentFixture<CommunityAudioChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityAudioChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommunityAudioChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
