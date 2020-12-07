import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CounterModePage } from './counter-mode.page';

const routes: Routes = [
  {
    path: '',
    component: CounterModePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CounterModePageRoutingModule {}
