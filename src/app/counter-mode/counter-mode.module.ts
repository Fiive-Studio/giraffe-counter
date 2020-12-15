import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CounterModePageRoutingModule } from './counter-mode-routing.module';

import { CounterModePage } from './counter-mode.page';
import { FooterComponent } from '../common/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CounterModePageRoutingModule
  ],
  declarations: [CounterModePage, FooterComponent]
})
export class CounterModePageModule {}
