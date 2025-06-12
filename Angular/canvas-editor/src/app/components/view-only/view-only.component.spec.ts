import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOnlyComponent } from './view-only.component';

describe('ViewOnlyComponent', () => {
  let component: ViewOnlyComponent;
  let fixture: ComponentFixture<ViewOnlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOnlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
