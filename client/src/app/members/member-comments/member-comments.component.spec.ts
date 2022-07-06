import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCommentsComponent } from './member-comments.component';

describe('MemberCommentsComponent', () => {
  let component: MemberCommentsComponent;
  let fixture: ComponentFixture<MemberCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
