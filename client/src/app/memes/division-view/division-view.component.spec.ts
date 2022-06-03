import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionViewComponent } from './division-view.component';

describe('DivisionViewComponent', () => {
  let component: DivisionViewComponent;
  let fixture: ComponentFixture<DivisionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
