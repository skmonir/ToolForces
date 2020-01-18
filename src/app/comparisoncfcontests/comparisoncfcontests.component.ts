import { Component, OnInit } from '@angular/core';
import {DynamicDialogRef} from 'primeng/api';
import {DynamicDialogConfig} from 'primeng/api';

@Component({
  selector: 'app-comparisoncfcontests',
  templateUrl: './comparisoncfcontests.component.html',
  styleUrls: ['./comparisoncfcontests.component.css']
})
export class ComparisoncfcontestsComponent implements OnInit {

  user1: string;
  user2: string;
  CF_Table_Data_Show = [];

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.user1 = this.config.data.user1;
    this.user2 = this.config.data.user2;
    this.CF_Table_Data_Show = this.config.data.table_data;
  }

}
