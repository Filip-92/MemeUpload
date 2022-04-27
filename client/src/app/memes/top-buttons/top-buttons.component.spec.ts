import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopButtonsComponent } from './top-buttons.component';

describe('TopButtonsComponent', () => {
  let component: TopButtonsComponent;
  let fixture: ComponentFixture<TopButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
