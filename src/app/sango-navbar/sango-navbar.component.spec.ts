import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SangoNavbarComponent } from './sango-navbar.component';

describe('SangoNavbarComponent', () => {
  let component: SangoNavbarComponent;
  let fixture: ComponentFixture<SangoNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SangoNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SangoNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
