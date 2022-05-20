import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarquizPopupComponent } from './starquiz-popup.component';

describe('StarquizPopupComponent', () => {
  let component: StarquizPopupComponent;
  let fixture: ComponentFixture<StarquizPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarquizPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StarquizPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
