import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeCardFavouriteComponent } from './meme-card-favourite.component';

describe('MemeCardFavouriteComponent', () => {
  let component: MemeCardFavouriteComponent;
  let fixture: ComponentFixture<MemeCardFavouriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemeCardFavouriteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemeCardFavouriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
