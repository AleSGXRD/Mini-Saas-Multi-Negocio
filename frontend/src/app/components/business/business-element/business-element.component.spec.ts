import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessElementComponent } from './business-element.component';

describe('BusinessElementComponent', () => {
  let component: BusinessElementComponent;
  let fixture: ComponentFixture<BusinessElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
