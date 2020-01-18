import {ScrollingModule} from '@angular/cdk/scrolling';
import {NgModule} from '@angular/core';

// PrimeNG Modules
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {
    ChartModule,
    ButtonModule,
    FieldsetModule,
    DropdownModule,
    MultiSelectModule,
    DialogModule,
    TooltipModule,
    AutoCompleteModule,
    OverlayPanelModule,
    ProgressBarModule
} from 'primeng/primeng';

@NgModule({
  exports: [
    ScrollingModule,
    ChartModule,
    ButtonModule,
    FieldsetModule,
    DropdownModule,
    MultiSelectModule,
    TableModule,
    DialogModule,
    TooltipModule,
    AutoCompleteModule,
    ToastModule,
    OverlayPanelModule,
    DynamicDialogModule,
    ProgressBarModule
  ]
})
export class PrimeNGModules {}