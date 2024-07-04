import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectChatHeaderComponent } from './direct-chat-header.component';

describe('DirectChatHeaderComponent', () => {
  let component: DirectChatHeaderComponent;
  let fixture: ComponentFixture<DirectChatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectChatHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectChatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
