import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareojratingComponent } from './compareojrating.component';

describe('CompareojratingComponent', () => {
  let component: CompareojratingComponent;
  let fixture: ComponentFixture<CompareojratingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareojratingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareojratingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
