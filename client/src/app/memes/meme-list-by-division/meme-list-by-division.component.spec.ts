import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeListByDivisionComponent } from './meme-list-by-division.component';

describe('MemeListByDivisionComponent', () => {
  let component: MemeListByDivisionComponent;
  let fixture: ComponentFixture<MemeListByDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemeListByDivisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemeListByDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
