import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Title } from '@angular/platform-browser';

export interface Problem {
  contestId: string,
  index: string,
  name: string,
  points: number,
  rating: number,
  tags: string[]
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  providers: [MessageService]
})
export class FilterComponent implements OnInit {
  Category = [
    { label: '2-sat', value: '2-sat' },
    { label: 'binary search', value: 'binary+search' },
    { label: 'bitmasks', value: 'bitmasks' },
    { label: 'brute force', value: 'brute+force' },
    { label: 'chinese remainder theorem', value: 'chinese+remainder+theorem' },
    { label: 'combinatorics', value: 'combinatorics' },
    { label: 'constructive algorithms', value: 'constructive+algorithms' },
    { label: 'data structures', value: 'data+structures' },
    { label: 'dfs and similar', value: 'dfs+and+similar' },
    { label: 'divide and conquer', value: 'divide+and+conquer' },
    { label: 'dp', value: 'dp' },
    { label: 'dsu', value: 'dsu' },
    { label: 'expression parsing', value: 'expression+parsing' },
    { label: 'fft', value: 'fft' },
    { label: 'flows', value: 'flows' },
    { label: 'games', value: 'games' },
    { label: 'geometry', value: 'geometry' },
    { label: 'graph matchings', value: 'graph+matchings' },
    { label: 'graphs', value: 'graphs' },
    { label: 'greedy', value: 'greedy' },
    { label: 'hashing', value: 'hashing' },
    { label: 'implementation', value: 'implementation' },
    { label: 'math', value: 'math' },
    { label: 'matrices', value: 'matrices' },
    { label: 'meet-in-the-middle', value: 'meet+in+the+middle' },
    { label: 'number theory', value: 'number theory' },
    { label: 'probabilities', value: 'probabilities' },
    { label: 'schedules', value: 'schedules' },
    { label: 'shortest paths', value: 'shortest+paths' },
    { label: 'sortings', value: 'sortings' },
    { label: 'string suffix structures', value: 'string+suffix+structures' },
    { label: 'strings', value: 'strings' },
    { label: 'ternary search', value: 'ternary+search' },
    { label: 'trees', value: 'trees' },
    { label: 'two pointers', value: 'two+pointers' },
  ];
  selectedCategories: string[] = [];

  probs: Problem[] = [];
  problems: Problem[] = [];

  isHiddenProgressBar: boolean = true;
  ratingOrder: number = 0;
  pointsOrder: number = 0;
  sortIconRating: string = "fas fa-sort";
  sortIconPoints: string = "fas fa-sort";

  constructor(private service: DataService, private messageService: MessageService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle(`Filter | ToolForces`);
  }

  initSortProperty() {
    this.ratingOrder = 0;
    this.pointsOrder = 0;
    this.sortIconRating = "fas fa-sort";
    this.sortIconPoints = "fas fa-sort";
  }

  sortProbRating() {
    this.pointsOrder = 0;
    this.sortIconPoints = "fas fa-sort";
    this.ratingOrder = (this.ratingOrder + 1) % 3;
    if (this.ratingOrder == 0) {
      this.sortIconRating = "fas fa-sort";
      this.probs = JSON.parse(JSON.stringify(this.problems));
    } else if (this.ratingOrder == 1) {
      this.sortIconRating = "fas fa-sort-up";
      this.probs.sort((a, b) => (a.rating > b.rating) ? 1 : ((b.rating > a.rating) ? -1 : 0));
    } else {
      this.sortIconRating = "fas fa-sort-down";
      this.probs.sort((a, b) => (a.rating < b.rating) ? 1 : ((b.rating < a.rating) ? -1 : 0));
    }
  }

  sortProbPoints() {
    this.ratingOrder = 0;
    this.sortIconRating = "fas fa-sort";
    this.pointsOrder = (this.pointsOrder + 1) % 3;
    if (this.pointsOrder == 0) {
      this.sortIconPoints = "fas fa-sort";
      this.probs = JSON.parse(JSON.stringify(this.problems));
    } else if (this.pointsOrder == 1) {
      this.sortIconPoints = "fas fa-sort-up";
      this.probs.sort((a, b) => (a.points > b.points) ? 1 : ((b.points > a.points) ? -1 : 0));
    } else {
      this.sortIconPoints = "fas fa-sort-down";
      this.probs.sort((a, b) => (a.points < b.points) ? 1 : ((b.points < a.points) ? -1 : 0));
    }
  }

  getFilteredProbs() {
    this.isHiddenProgressBar = false;
    this.getCodeforcesFilteredProblems();
  }

  getCodeforcesFilteredProblems() {
    this.problems = [];
    let codeforcesApiUrl = 'https://codeforces.com/api/problemset.problems?tags=' + this.selectedCategories[0];
    for (let i = 1; i < this.selectedCategories.length; ++i) {
      codeforcesApiUrl = codeforcesApiUrl + ';' + this.selectedCategories[i];
    }
    this.service.callCodeForcesApi(codeforcesApiUrl).subscribe(response => {
      for (let i = 0; i < response['result']['problems'].length; ++i) {
        this.problems.push({
          contestId: response['result']['problems'][i].contestId,
          index: response['result']['problems'][i].index,
          name: response['result']['problems'][i].name,
          rating: response['result']['problems'][i].rating == undefined ? 0 : response['result']['problems'][i].rating,
          points: response['result']['problems'][i].points == undefined ? 0 : response['result']['problems'][i].points,
          tags: response['result']['problems'][i].tags
        });
      }
      setTimeout(() => {
        this.initSortProperty();
        this.isHiddenProgressBar = true;
        this.probs = JSON.parse(JSON.stringify(this.problems));
      }, 2000);
    }, error => {
      this.isHiddenProgressBar = true;
      this.messageService.add({ severity: 'error', summary: 'Codeforces Error', detail: 'Please try again later.' });
    });
  }

  reset() {
    this.selectedCategories = [];
  }

}
