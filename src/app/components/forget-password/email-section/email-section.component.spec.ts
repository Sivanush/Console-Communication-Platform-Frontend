import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSectionComponent } from './email-section.component';

describe('EmailSectionComponent', () => {
  let component: EmailSectionComponent;
  let fixture: ComponentFixture<EmailSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
