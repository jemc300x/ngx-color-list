import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxColorListComponent } from './ngx-color-list.component';

describe('NgxColorListComponent', () => {
  let component: NgxColorListComponent;
  let fixture: ComponentFixture<NgxColorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxColorListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxColorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
