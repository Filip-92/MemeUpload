import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeRandomComponent } from './meme-random.component';

describe('MemeRandomComponent', () => {
  let component: MemeRandomComponent;
  let fixture: ComponentFixture<MemeRandomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemeRandomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemeRandomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
