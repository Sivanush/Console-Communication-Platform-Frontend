import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectVoiceCallComponent } from './direct-voice-call.component';

describe('DirectVoiceCallComponent', () => {
  let component: DirectVoiceCallComponent;
  let fixture: ComponentFixture<DirectVoiceCallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectVoiceCallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectVoiceCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
