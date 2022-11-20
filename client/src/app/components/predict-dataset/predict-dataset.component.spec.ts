import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictDatasetComponent } from './predict-dataset.component';

describe('PredictDatasetComponent', () => {
  let component: PredictDatasetComponent;
  let fixture: ComponentFixture<PredictDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PredictDatasetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PredictDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
