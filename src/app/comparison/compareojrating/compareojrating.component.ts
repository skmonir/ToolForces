import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-compareojrating',
  templateUrl: './compareojrating.component.html',
  styleUrls: ['./compareojrating.component.css']
})
export class CompareojratingComponent implements OnInit {
  chartData = {
    labels: ['CodeForces', 'CodeChef', 'HackerRank', 'Toph'],
    datasets: [
      {
        label: 'First User',
        backgroundColor: '#36A2EB',
        data: [0, 0, 0, 0]
      },
      {
        label: 'Second User',
        backgroundColor: '#4bc0c0',
        data: [0, 0, 0, 0]
      }
    ]
  }

  BAR_Chart_Data_Show = {};

  platforms = [
    { label: 'CodeForces', value: 'CodeForces' },
    { label: 'CodeChef', value: 'CodeChef' },
    { label: 'AtCoder', value: 'AtCoder' },
    { label: 'HackerRank', value: 'HackerRank' },
    { label: 'Toph', value: 'Toph' },
  ];

  dataModel = {
    'CodeForces': ['', ''],
    'CodeChef': ['', ''],
    'AtCoder': ['', ''],
    'HackerRank': ['', ''],
    'Toph': ['', ''],
  }

  selectedPlatforms = [];

  handles: string[] = [];
  suggestedHandles: string[] = [];

  constructor(private service: DataService) { }

  ngOnInit() {
    this.service.getAllHandles().subscribe(response => {
      this.handles = response;
    });
  }

  filterHandle(event: { query: any; }) {
    let query = event.query;
    this.suggestedHandles = [];
    for (let i = 0; query.length > 1 && i < this.handles.length; i++) {
      if (this.handles[i].toLowerCase().indexOf(query.toLowerCase()) == 0) {
        this.suggestedHandles.push(this.handles[i]);
      }
    }
  }

  showComparison() {
    this.chartData.datasets[0].data = [0, 0, 0, 0];
    this.chartData.datasets[1].data = [0, 0, 0, 0];

    if (this.selectedPlatforms.includes('CodeForces')) {
      let user1 = this.dataModel['CodeForces'][0];
      let user2 = this.dataModel['CodeForces'][1];
      let url = `https://codeforces.com/api/user.info?handles=${user1};${user2}`;
      this.service.callCodeForcesApi(url).subscribe(response => {
        this.chartData.datasets[0].data[0] = response['result'][0].rating;
        this.chartData.datasets[1].data[0] = response['result'][1].rating;
        // this.BAR_Chart_Data_Show = JSON.parse(JSON.stringify(this.chartData));
      });
    }

    if (this.selectedPlatforms.includes('Toph')) {
      let user1 = this.dataModel['Toph'][0];
      let user2 = this.dataModel['Toph'][1];
      this.service.getTophUserRating(user1).subscribe(response1 => {
        this.service.getTophUserRating(user2).subscribe(response2 => {
          this.chartData.datasets[0].data[3] = response1['result'];
          this.chartData.datasets[1].data[3] = response2['result'];
          // this.BAR_Chart_Data_Show = JSON.parse(JSON.stringify(this.chartData));
        });
      });
    }

    setTimeout(() => {
      this.BAR_Chart_Data_Show = JSON.parse(JSON.stringify(this.chartData));
    }, 5000)
  }

}
