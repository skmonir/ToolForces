import { DataService } from './../../data.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compareojsolutioncount',
  templateUrl: './compareojsolutioncount.component.html',
  styleUrls: ['./compareojsolutioncount.component.css']
})
export class CompareojsolutioncountComponent implements OnInit {

  probs = {};
  constructor(private http: HttpClient, private service: DataService) { }

  ngOnInit() {
    // this.http.get('https://uhunt.onlinejudge.org/api/p').subscribe(response => {
    //   this.probs = JSON.parse(JSON.stringify(response));
    // });
    this.service.getAllUvaProbs().subscribe(response => {
      this.probs = response;
      console.log(this.probs['63']);
    });
  }

}
