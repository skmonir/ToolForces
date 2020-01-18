import { CompareojsolutioncountComponent } from './comparison/compareojsolutioncount/compareojsolutioncount.component';
import { CompareojratingComponent } from './comparison/compareojrating/compareojrating.component';
import { ComparecfratingComponent } from './comparison/comparecfrating/comparecfrating.component';
import { FilterComponent } from './filter/filter.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContestsComponent } from './contests/contests.component';
import { SubmissionsComponent } from './submissions/submissions.component';

const routes: Routes = [
  { path: '', redirectTo: 'contests', pathMatch: 'full'},
  { path: 'contests', component:  ContestsComponent},
  { path: 'filter', component:  FilterComponent},
  { path: 'submissions', component:  SubmissionsComponent},
  { path: 'comparison', component:  ComparecfratingComponent},
  // { path: 'comparison/ojrating', component:  CompareojratingComponent},
  // { path: 'comparison/ojsolutioncount', component:  CompareojsolutioncountComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
