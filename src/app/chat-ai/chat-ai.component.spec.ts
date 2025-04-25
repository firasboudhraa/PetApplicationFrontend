import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAIComponent } from './chat-ai.component';

describe('ChatAIComponent', () => {
  let component: ChatAIComponent;
  let fixture: ComponentFixture<ChatAIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatAIComponent]
    });
    fixture = TestBed.createComponent(ChatAIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
