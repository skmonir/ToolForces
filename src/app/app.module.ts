import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DomainService } from './domain.service';
import { DataService } from './data.service';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PrimeNGModules } from './primeNG-modules';
import { NavComponent } from './nav/nav.component';
import { ContestsComponent } from './contests/contests.component';
import { ComparisonComponent } from './comparison/comparison.component';
import { HttpClientModule } from '@angular/common/http';
import { ComparisoncfcontestsComponent } from './comparisoncfcontests/comparisoncfcontests.component';
import { FilterComponent } from './filter/filter.component';
import { ComparecfratingComponent } from './comparison/comparecfrating/comparecfrating.component';

import { CountdownModule } from 'ngx-countdown';
import { CompareojratingComponent } from './comparison/compareojrating/compareojrating.component';
import { SubmissionsComponent } from './submissions/submissions.component';
import { CompareojsolutioncountComponent } from './comparison/compareojsolutioncount/compareojsolutioncount.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ContestsComponent,
    ComparisonComponent,
    ComparisoncfcontestsComponent,
    FilterComponent,
    ComparecfratingComponent,
    CompareojratingComponent,
    SubmissionsComponent,
    CompareojsolutioncountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    PrimeNGModules,
    CountdownModule
  ],
  providers: [
    Title,
    DataService,
    DomainService,
    DynamicDialogModule
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ComparisoncfcontestsComponent
  ]
})
export class AppModule { }
