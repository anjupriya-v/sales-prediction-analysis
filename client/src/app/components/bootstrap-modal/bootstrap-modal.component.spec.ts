import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapModalComponent } from './bootstrap-modal.component';

describe('BootstrapModalComponent', () => {
  let component: BootstrapModalComponent;
  let fixture: ComponentFixture<BootstrapModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BootstrapModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BootstrapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
