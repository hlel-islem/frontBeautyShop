import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinaliserCommande } from './finaliser-commande';

describe('FinaliserCommande', () => {
  let component: FinaliserCommande;
  let fixture: ComponentFixture<FinaliserCommande>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinaliserCommande]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinaliserCommande);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
