import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/api';
import { DataService } from '../../data.service';
import { ComparisoncfcontestsComponent } from './../../comparisoncfcontests/comparisoncfcontests.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-comparecfrating',
  templateUrl: './comparecfrating.component.html',
  styleUrls: ['./comparecfrating.component.css'],
  providers: [MessageService, DialogService]
})
export class ComparecfratingComponent implements OnInit {

  platforms = [
    { label: 'CodeForces', value: 'codeforces', readonly: true },
    { label: 'UVa', value: 'uva' },
    { label: 'Spoj', value: 'spoj' },
    { label: 'Toph', value: 'toph' },
    { label: 'HackerRank', value: 'hackerrank' },
    { label: 'HackerEarth', value: 'hackerearth' },
  ];

  selectedPlatforms = ['codeforces'];

  // Comparison Handles ngModel
  cf1: string = '';
  cf2: string = '';

  // Comparison Handles UI View
  CF_USER_INFO = [{ rating: 0, country: '', titlePhoto: '' }, { rating: 0, country: '', titlePhoto: '' }];
  CF_Show_1: string;
  CF_Show_2: string;
  CF_Table_Data_Show = [];
  CF_Line_Chart_Data_Show = {};

  isDataReady: boolean = false;
  CF_Line_Chart_Data = {
    labels: [],
    datasets: [
      // { label: '', data: [], fill: true, borderColor: 'rgba(179, 181, 198, 1)', backgroundColor: 'rgba(179, 181, 198, 0.2)' },
      { label: '', data: [], fill: true, borderColor: '#ff6384' },
      { label: '', data: [], fill: true, borderColor: '#4bc0c0' }
    ]
  }
  CF_Line_Chart_Options = {
    title: {
      display: true,
      text: 'This rating graph is based on the contests they both competed.',
      fontSize: 12,
      // position: 'bottom'
    },
    animation: {
      duration: 3000
    },
    legend: {
      position: 'bottom'
    }
  };

  suggestedHandles: string[] = [];

  handles: string[] = [];

  isHiddenProgressBar: boolean = true;

  constructor(private service: DataService,
    private messageService: MessageService,
    public dialogService: DialogService,
    private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Comparison | ToolForces');
    this.service.getAllHandles().subscribe(response => {
      this.handles = response;
    });
  }

  showContestsTable() {
    const ref = this.dialogService.open(ComparisoncfcontestsComponent, {
      data: {
        user1: this.CF_Line_Chart_Data.datasets[0].label,
        user2: this.CF_Line_Chart_Data.datasets[1].label,
        table_data: this.CF_Table_Data_Show.slice(0)
      },
      header: 'List of the contests they both competed',
      width: '70%',
      contentStyle: { "max-height": "450px", "overflow": "auto" }
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

  async showComparison() {
    this.isHiddenProgressBar = false;
    await this.getCodeforcesUserRating(this.cf1, this.cf2);
  }

  async getCodeforcesUserRating(user1: string, user2: string) {
    this.isDataReady = false;
    this.CF_Line_Chart_Data_Show = {};
    document.getElementById('cf_graph_title_1').innerHTML = '';
    document.getElementById('cf_graph_title_2').innerHTML = '';
    document.getElementById('cf_graph_rank_1').innerHTML = '';
    document.getElementById('cf_graph_rank_2').innerHTML = '';
    document.getElementById('cf_graph_title_vs').innerHTML = '';

    let url = 'https://codeforces.com/api/user.rating?handle=' + user1;
    this.service.callCodeForcesApi(url).subscribe(response1 => {
      url = 'https://codeforces.com/api/user.rating?handle=' + user2;
      this.service.callCodeForcesApi(url).subscribe(response2 => {
        this.CF_Table_Data_Show = [];
        this.CF_Line_Chart_Data.labels = [];
        this.CF_Line_Chart_Data.datasets[0].data = [];
        this.CF_Line_Chart_Data.datasets[1].data = [];
        this.CF_Line_Chart_Data.datasets[0].label = user1;
        this.CF_Line_Chart_Data.datasets[1].label = user2;

        for (let i = 0; i < response2['result'].length; ++i) {
          let c2 = response2['result'][i].contestId;
          for (let j = 0; j < response1['result'].length; ++j) {
            let c1 = response1['result'][j].contestId;
            if (c1 == c2) {
              this.CF_Line_Chart_Data.labels.push('');
              this.CF_Line_Chart_Data.datasets[0].data.push(response1['result'][j].newRating);
              this.CF_Line_Chart_Data.datasets[1].data.push(response2['result'][i].newRating);
              this.CF_Table_Data_Show.push({
                contestId: response1['result'][j].contestId,
                contestName: response1['result'][j].contestName,
                rating1: response1['result'][j].newRating,
                rating2: response2['result'][i].newRating,
                rank1: response1['result'][j].rank,
                rank2: response2['result'][i].rank
              });
            }
          }
        }

        // Getting the users info
        this.service.callCodeForcesApi('https://codeforces.com/api/user.info?handles=' + user1 + ';' + user2).subscribe(response => {
          this.CF_USER_INFO = response['result'];
          this.CF_Table_Data_Show = this.CF_Table_Data_Show.reverse();
        });

        // Storing graph data to UI container
        this.CF_Line_Chart_Data_Show = JSON.parse(JSON.stringify(this.CF_Line_Chart_Data));

        setTimeout(() => {
          // Getting handle color according to the rating
          this.isDataReady = true;
          this.isHiddenProgressBar = true;

          if (response1['result'].length == 0) {
            document.getElementById('cf_graph_title_1').innerHTML = '<strong>' + user1 + '</strong>';
            document.getElementById('cf_graph_rank_1').innerHTML = '<strong>Unrated&nbsp;</strong>';
          } else {
            let user1_current_rating = response1['result'][response1['result'].length - 1].newRating;
            document.getElementById('cf_graph_title_1').innerHTML = this.getColoredHandle(user1, user1_current_rating);
            document.getElementById('cf_graph_rank_1').innerHTML = this.getColoredRank(user1_current_rating);
          }

          document.getElementById('cf_graph_title_vs').innerHTML = '&nbsp;&nbsp;&nbsp; vs &nbsp;&nbsp;&nbsp;';

          if (response2['result'].length == 0) {
            document.getElementById('cf_graph_title_2').innerHTML = '<strong>' + user2 + '</strong>';
            document.getElementById('cf_graph_rank_2').innerHTML = '<strong>Unrated&nbsp;</strong>';
          } else {
            let user2_current_rating = response2['result'][response2['result'].length - 1].newRating;
            document.getElementById('cf_graph_title_2').innerHTML = this.getColoredHandle(user2, user2_current_rating);
            document.getElementById('cf_graph_rank_2').innerHTML = this.getColoredRank(user2_current_rating);
          }

        }, 0);
      }, error => {
        this.isHiddenProgressBar = true;
        this.showToast('error', 'CodeForces Error', 'Check handles or try again.');
      });
    }, error => {
      this.isHiddenProgressBar = true;
      this.showToast('error', 'CodeForces Error', 'Check handles or try again.');
    });
  }

  getColoredHandle(user: string, rating: number) {
    if (user == '' || user == null || rating == null) {
      return '';
    } else {
      let res = user;
      if (rating < 1200) {
        res = '<span style="color: #6c757d">' + user + '<span>';
      } else if (rating < 1400) {
        res = '<span style="color: #28a745">' + user + '<span>';
      } else if (rating < 1600) {
        res = '<span style="color: #4bc0c0">' + user + '<span>';
      } else if (rating < 1900) {
        res = '<span style="color: #007bff">' + user + '<span>';
      } else if (rating < 2100) {
        res = '<span style="color: #a0a">' + user + '<span>';
      } else if (rating < 2400) {
        res = '<span style="color: #FF8C00">' + user + '<span>';
      } else if (rating < 3000) {
        res = '<span style="color: red">' + user + '<span>';
      } else {
        res = user[0] + '<span style="color: red">' + user.substring(1) + '<span>';
      }

      res = '<strong>' + res + '</strong>';
      return res;
    }
  }

  getColoredRank(rating: number) {
    let res = '';
    if (rating < 1200) {
      res = '<span style="color: #6c757d">Newbie &nbsp<span>';
    } else if (rating < 1400) {
      res = '<span style="color: #28a745">Pupil &nbsp<span>';
    } else if (rating < 1600) {
      res = '<span style="color: #4bc0c0">Specialist &nbsp<span>';
    } else if (rating < 1900) {
      res = '<span style="color: #007bff">Expert &nbsp<span>';
    } else if (rating < 2100) {
      res = '<span style="color: #a0a">Candidate Master &nbsp<span>';
    } else if (rating < 2300) {
      res = '<span style="color: #FF8C00">Master &nbsp<span>';
    } else if (rating < 2400) {
      res = '<span style="color: #FF8C00">International Master &nbsp<span>';
    } else if (rating < 2600) {
      res = '<span style="color: red">Grand Master &nbsp<span>';
    } else if (rating < 3000) {
      res = '<span style="color: red">International Grandmaster &nbsp<span>';
    } else {
      res = '<span style="color: red">Legendary Grandmaster &nbsp<span>';
    }

    res = '<strong>' + res + '</strong>';
    return res;
  }

  showToast(Severity: string, Summary: string, Detail: string) {
    this.messageService.add({ severity: Severity, summary: Summary, detail: Detail });
  }

  reset() {
    this.cf1 = '';
    this.cf2 = '';
  }

  disableCompareBtn() {
    return this.cf1.length < 2 || this.cf2.length < 2 || this.cf1 == this.cf2;
  }

  disableResetBtn() {
    return this.cf1 == '' && this.cf2 == '';
  }

}
