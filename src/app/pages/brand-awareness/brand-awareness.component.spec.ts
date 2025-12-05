import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandAwarenessComponent } from './brand-awareness.component';

describe('BrandAwarenessComponent', () => {
  let component: BrandAwarenessComponent;
  let fixture: ComponentFixture<BrandAwarenessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrandAwarenessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandAwarenessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
