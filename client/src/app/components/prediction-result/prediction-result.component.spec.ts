import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictionResultComponent } from './prediction-result.component';

describe('PredictionResultComponent', () => {
  let component: PredictionResultComponent;
  let fixture: ComponentFixture<PredictionResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictionResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PredictionResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
