import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchDivisionComponent } from './switch-division.component';

describe('SwitchDivisionComponent', () => {
  let component: SwitchDivisionComponent;
  let fixture: ComponentFixture<SwitchDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchDivisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
