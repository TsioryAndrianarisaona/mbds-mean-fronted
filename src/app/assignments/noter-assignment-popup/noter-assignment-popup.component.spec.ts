import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoterAssignmentPopupComponent } from './noter-assignment-popup.component';

describe('NoterAssignmentPopupComponent', () => {
  let component: NoterAssignmentPopupComponent;
  let fixture: ComponentFixture<NoterAssignmentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoterAssignmentPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoterAssignmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
