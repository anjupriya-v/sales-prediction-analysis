import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedPredictionsComponent } from './saved-predictions.component';

describe('SavedPredictionsComponent', () => {
  let component: SavedPredictionsComponent;
  let fixture: ComponentFixture<SavedPredictionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedPredictionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedPredictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
