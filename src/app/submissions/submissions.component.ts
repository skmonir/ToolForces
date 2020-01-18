import { DataService } from 'src/app/data.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.css'],
  providers: [MessageService]
})
export class SubmissionsComponent implements OnInit {
  verdicts = [
    { verdict: 'Any', value: 'ANY' },
    { verdict: 'Accepted', value: 'AC' },
    { verdict: 'Wrong Answer', value: 'WA' },
    { verdict: 'Runtime Error', value: 'RE' },
    { verdict: 'Compilation Error', value: 'CE' },
    { verdict: 'Time Limit Exceeded', value: 'TLE' },
    { verdict: 'Memory Limit Exceeded', value: 'MLE' },
  ];

  verdictMap = {
    'OK': 'AC',
    'Accepted': 'AC',
    'WRONG_ANSWER': 'WA',
    'Wrong Answer': 'WA',
    'RUNTIME_ERROR': 'RE',
    'Runtime Error': 'RE',
    'COMPILATION_ERROR': 'CE',
    'Compilation Error': 'CE',
    'PRESENTATION_ERROR': 'PE',
    'IDLENESS_LIMIT_EXCEEDED': 'ILE',
    'SKIPPED': 'Skipped',
    'REJECTED': 'Rejected',
    'CHALLENGED': 'Challenged',
    'CRASHED': 'Crashed',
    'Passed': 'Passed',
    'FAILED': 'Failed',
    'PARTIAL': 'Partial',
    'SECURITY_VIOLATED': 'SV',
    'INPUT_PREPARATION_CRASHED': 'IPC',
    'TIME_LIMIT_EXCEEDED': 'TLE',
    'CPU Limit Exceeded': 'TLE',
    'MEMORY_LIMIT_EXCEEDED': 'MLE',
    'Memory Limit Exceeded': 'MLE',
    'TESTING': 'In queue',
    '10': 'SE',
    '15': "Failed",
    '20': 'In queue',
    '30': 'CE',
    '35': 'SV',
    '40': 'RE',
    '45': 'OLE',
    '50': 'TLE',
    '60': 'MLE',
    '70': 'WA',
    '80': 'PE',
    '90': 'AC'
  };

  verdictTooltipMap = {
    'AC': 'Accepted',
    'WA': 'Wrong Answer',
    'RE': 'Runtime Error',
    'CE': 'Compilation Error',
    'PE': 'Presentation Error',
    'ILE': 'Idleness Limit Exceeded',
    'Skipped': 'Skipped',
    'Challenged': 'Challenged',
    'Crashed': 'Crashed',
    'Failed': 'Failed',
    'Partial': 'Partial',
    'SV': 'Security Violated',
    'IPC': 'Input Preparation Crashed',
    'TLE': 'Time Limit Exceeded',
    'MLE': 'Memory Limit Exceeded',
    'SE': 'Submission Error',
    'In queue': 'In queue',
    'OLE': 'Output Limit Exceeded'
  };

  langMap = {
    '1': 'GNU C',
    '2': 'Java',
    '3': 'GNU C++',
    '4': 'Pascal',
    '5': 'GNU C++11',
  };

  platforms = [
    { label: 'CodeForces', value: 'CodeForces' },
    { label: 'UVa', value: 'UVa' },
    { label: 'Spoj', value: 'Spoj' },
    { label: 'Toph', value: 'Toph' },
  ];

  dataModel = {
    'CodeForces': '',
    'UVa': '',
    'Spoj': '',
    'Toph': '',
  }

  statVerdict = ['AC', 'WA', 'RE', 'CE', 'TLE', 'MLE', 'PE'];
  acceptedList = [];

  uva_probs = {};
  selectedPlatforms = [];
  selectedVerdict = { verdict: '', value: '' };

  handles: string[] = [];
  suggestedHandles: string[] = [];

  subs = [];
  submissions = [];
  foo: number = 0;
  spoj_pages = 0;
  isHiddenProgressBar: boolean = true;
  isNoticeHidden: boolean = false;
  isFilterHidden: boolean = true;

  Stat_Pie_Chart_Data = {
    labels: ['AC', 'WA', 'RE', 'CE', 'TLE', 'MLE', 'PE', 'Others'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
          "#9CCC65",
          "#FF6384",
          "#00AAAA",
          '#AAAA00',
          '#36A2EB',
          '#FFCE56',
          '#666600',
          'gray'
        ],
        hoverBackgroundColor: [
          "#9CCC65",
          "#FF6384",
          "#00AAAA",
          '#AAAA00',
          '#36A2EB',
          '#FFCE56',
          '#666600',
          'gray'
        ]
      }
    ]
  };

  Stat_Pie_Chart_Data_Show = {};

  Stat_Pie_Chart_Options = {
    animation: {
      duration: 3000
    },
    legend: {
      position: 'bottom'
    }
  };

  constructor(private service: DataService, private messageService: MessageService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Submissions | ToolForces');
    this.service.getAllHandles().subscribe(response => {
      this.handles = response;
    });
    this.service.getAllUvaProbs().subscribe(response => {
      this.uva_probs = response;
    });
  }

  init() {
    this.foo = 0;
    this.submissions = [];
    this.isFilterHidden = true;
    this.isHiddenProgressBar = false;
    this.selectedVerdict = { verdict: '', value: '' };
    this.acceptedList = [];
    this.Stat_Pie_Chart_Data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0];
  }

  tick: number = 0;
  processing() {
    setTimeout(() => {
      ++this.tick;
      let cmp = this.selectedPlatforms.length;
      if (this.selectedPlatforms.includes('Toph')) {
        cmp += 4;
      }
      if (this.foo == cmp || this.tick == 10) {
        this.isHiddenProgressBar = true;
        this.subs = JSON.parse(JSON.stringify(this.submissions));
        this.Stat_Pie_Chart_Data_Show = JSON.parse(JSON.stringify(this.Stat_Pie_Chart_Data));
        this.isFilterHidden = this.submissions.length == 0;
      } else {
        this.processing();
      }
    }, 3000);
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

  showSubmissions() {
    this.tick = 0;
    this.init();
    this.processing();
    if (this.selectedPlatforms.includes('CodeForces')) {
      this.getCodeForcesSubmissions();
    }
    if (this.selectedPlatforms.includes('UVa')) {
      this.getUVaSubmissions();
    }
    if (this.selectedPlatforms.includes('Toph')) {
      this.getTophSubmissions();
    }
    if (this.selectedPlatforms.includes('Spoj')) {
      this.getSpojSubmissions();
    }
  }

  getCodeForcesSubmissions() {
    let user = this.dataModel['CodeForces'];
    let url = `https://codeforces.com/api/user.status?handle=${user}`;
    this.service.callCodeForcesApi(url).subscribe(response => {
      let currentTime = new Date().getTime() / 1000;
      for (let i = 0; i < response['result'].length; ++i) {
        if (currentTime - response['result'][i].creationTimeSeconds <= 2592000) {
          this.submissions.push({
            problem: `${response['result'][i]['problem'].index}. ${response['result'][i]['problem'].name}`,
            url: this.getCodeForcesProblemUrl(response['result'][i]['problem'].contestId, response['result'][i]['problem'].index),
            where: 'codeforces',
            subEpoch: response['result'][i].creationTimeSeconds,
            when: this.getHumanDate(response['result'][i].creationTimeSeconds),
            language: response['result'][i].programmingLanguage,
            verdict: this.verdictMap[response['result'][i].verdict],
            time: "" + response['result'][i].timeConsumedMillis + ' ms',
            memory: "" + Math.floor(response['result'][i].memoryConsumedBytes / 1000) + ' KB',
            verdictTooltip: this.verdictTooltipMap[this.verdictMap[response['result'][i].verdict]]
          });
          let verdict = this.verdictMap[response['result'][i].verdict];
          if (this.statVerdict.includes(verdict)) {
            this.Stat_Pie_Chart_Data.datasets[0].data[this.statVerdict.indexOf(verdict)]++;
          } else {
            this.Stat_Pie_Chart_Data.datasets[0].data[7]++;
          }
          if (verdict == 'AC') {
            let probID = "" + response['result'][i]['problem'].contestId + response['result'][i]['problem'].index;
            if (!this.acceptedList.includes(probID)) {
              this.acceptedList.push(probID);
            }
          }
        }
      }
      this.foo++;
      this.submissions.sort((a, b) => (a.subEpoch < b.subEpoch) ? 1 : ((b.subEpoch < a.subEpoch) ? -1 : 0));
    }, error => {
      this.foo++;
      this.messageService.add({ severity: 'error', summary: 'Codeforces Error', detail: 'Please Check handle or try later.' });
    });
  }

  getSpojSubmissions() {
    let user = this.dataModel['Spoj'];
    this.service.getSpojSubsPages(user).subscribe(async resp => {
      this.spoj_pages = resp['pages'];
      if (resp['pages'] == 0) {
        this.foo++;
        this.messageService.add({ severity: 'error', summary: 'Spoj Error', detail: 'Please Check handle or try later.' });
      } else {
        for (let i = 0; i < this.spoj_pages; ++i) {
          await this.service.getSpojSubmissions(user, i * 20).subscribe(response => {
            let currentTime = new Date().getTime() / 1000;
            for (let j = 0; j < response['subs'].length; ++j) {
              if (currentTime - response['subs'][j]['when'] <= 2592000) {
                this.submissions.push({
                  problem: response['subs'][j]['problem'],
                  url: 'https://spoj.com' + response['subs'][j]['url'],
                  where: 'spoj',
                  subEpoch: response['subs'][j]['when'],
                  when: this.getHumanDate(response['subs'][j]['when']),
                  language: response['subs'][j]['lang'],
                  verdict: this.getSpojVerdict(response['subs'][j]['verdict']),
                  time: response['subs'][j]['time'],
                  memory: response['subs'][j]['memory'],
                  verdictTooltip: response['subs'][j]['verdict']
                });
                let verdict = this.getSpojVerdict(response['subs'][j]['verdict']);
                if (this.statVerdict.includes(verdict)) {
                  this.Stat_Pie_Chart_Data.datasets[0].data[this.statVerdict.indexOf(verdict)]++;
                } else {
                  this.Stat_Pie_Chart_Data.datasets[0].data[7]++;
                }
                if (verdict == 'AC') {
                  let probID = "" + response['subs'][j]['url'].substring(10);
                  if (!this.acceptedList.includes(probID)) {
                    this.acceptedList.push(probID);
                  }
                }
              }
            }
            if ((i + 1) == this.spoj_pages) this.foo++;
            this.submissions.sort((a, b) => (a.subEpoch < b.subEpoch) ? 1 : ((b.subEpoch < a.subEpoch) ? -1 : 0));
          });
        }
      }
    });
  }

  getTophSubmissions() {
    let user = this.dataModel['Toph'];
    this.service.getTophUserId(user).subscribe(async resp => {
      if (resp['message'] != null) {
        this.foo += 5;
        this.messageService.add({ severity: 'error', summary: 'Toph Error', detail: 'Please Check handle or try later.' });
      } else {
        let userId = resp['result'];
        for (let i = 0; i < 320; i += 64) {
          await this.service.getTophSubmissions(userId, i).subscribe(response => {
            let currentTime = new Date().getTime() / 1000;
            for (let j = 0; j < response['subs'].length; ++j) {
              if (currentTime - response['subs'][j]['when'] <= 2592000) {
                this.submissions.push({
                  problem: response['subs'][j]['problem'],
                  url: 'https://toph.co' + response['subs'][j]['url'],
                  where: 'toph',
                  subEpoch: response['subs'][j]['when'],
                  when: this.getHumanDate(response['subs'][j]['when']),
                  language: response['subs'][j]['lang'],
                  verdict: this.verdictMap[response['subs'][j]['verdict']],
                  time: response['subs'][j]['time'],
                  memory: response['subs'][j]['memory'],
                  verdictTooltip: this.verdictTooltipMap[this.verdictMap[response['subs'][j]['verdict']]]
                });
                let verdict = this.verdictMap[response['subs'][j]['verdict']];
                if (this.statVerdict.includes(verdict)) {
                  this.Stat_Pie_Chart_Data.datasets[0].data[this.statVerdict.indexOf(verdict)]++;
                } else {
                  this.Stat_Pie_Chart_Data.datasets[0].data[7]++;
                }
                if (verdict == 'AC') {
                  let probID = "" + response['subs'][j]['url'].substring(3);
                  if (!this.acceptedList.includes(probID)) {
                    this.acceptedList.push(probID);
                  }
                }
              }
            }
            this.foo++;
            this.submissions.sort((a, b) => (a.subEpoch < b.subEpoch) ? 1 : ((b.subEpoch < a.subEpoch) ? -1 : 0));
          });
        }
      }
    });
  }

  getUVaSubmissions() {
    let user = this.dataModel['UVa'];
    this.service.getUVaSubmissions(user).subscribe(response => {
      let currentTime = new Date().getTime() / 1000;
      for (let i = 0; i < response['subs'].length; ++i) {
        if (currentTime - response['subs'][i]['4'] <= 2592000) {
          this.submissions.push({
            problem: this.uva_probs[response['subs'][i]['1']],
            url: this.getUVaProblemUrl(response['subs'][i]['1']),
            where: 'uva',
            subEpoch: response['subs'][i]['4'] - 900,
            when: this.getHumanDate(response['subs'][i]['4'] - 973),
            language: this.langMap[response['subs'][i]['5']],
            verdict: this.verdictMap[response['subs'][i]['2']],
            time: "" + response['subs'][i]['3'] + ' ms',
            memory: '-',
            verdictTooltip: this.verdictTooltipMap[this.verdictMap[response['subs'][i]['2']]]
          });
          let verdict = this.verdictMap[response['subs'][i]['2']];
          if (this.statVerdict.includes(verdict)) {
            this.Stat_Pie_Chart_Data.datasets[0].data[this.statVerdict.indexOf(verdict)]++;
          } else {
            this.Stat_Pie_Chart_Data.datasets[0].data[7]++;
          }
          if (verdict == 'AC') {
            let probID = "" + response['subs'][i]['1'];
            if (!this.acceptedList.includes(probID)) {
              this.acceptedList.push(probID);
            }
          }
        }
      }
      this.foo++;
      this.submissions.sort((a, b) => (a.subEpoch < b.subEpoch) ? 1 : ((b.subEpoch < a.subEpoch) ? -1 : 0));
    }, error => {
      this.foo++;
      this.messageService.add({ severity: 'error', summary: 'UVa Error', detail: 'Please Check UserID or try later.' });
    });
  }

  isNumeric(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  getSpojVerdict(verdict: string) {
    if (verdict.includes('accepted')) return 'AC';
    else if (verdict.includes('wrong answer')) return 'WA';
    else if (verdict.includes('compilation error')) return 'CE';
    else if (verdict.includes('time limit exceeded')) return 'TLE';
    else if (verdict.includes('memory limit exceeded')) return 'MLE';
    else if (verdict.includes('runtime error')) return 'RE';
    else if (this.isNumeric(verdict)) verdict;
  }

  getHumanDate(epoch: number) {
    let d = new Date(0);
    d.setUTCSeconds(epoch);
    let t = "" + d;
    t = t.substring(0, 31);
    t = t.substring(0, 3) + ',' + t.substring(3);
    t = t.substring(0, 8) + '-' + t.substring(9);
    t = t.substring(0, 11) + '-' + t.substring(12);
    t = t.substring(0, 16) + ',' + t.substring(16);
    return t.substring(5);
  }

  getCodeForcesProblemUrl(contestId: number, index: number) {
    if (contestId < 100001) {
      return `https://codeforces.com/contest/${contestId}/problem/${index}`;
    } else {
      return `https://codeforces.com/gym/${contestId}/problem/${index}`;
    }
  }

  getUVaProblemUrl(probId: number) {
    return `https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem=${probId}`;
  }

  disableSubsBtn() {
    let disable = false;
    if (this.selectedPlatforms.length == 0) {
      disable = true;
    }
    for (let i = 0; i < this.selectedPlatforms.length; ++i) {
      if (this.dataModel[this.selectedPlatforms[i]].length == 0) {
        disable = true;
      }
    }
    return disable;
  }

  disableResetBtn() {
    let disable = true;
    for (let i = 0; i < this.selectedPlatforms.length; ++i) {
      if (this.dataModel[this.selectedPlatforms[i]].length > 0) {
        disable = false;
      }
    }
    return disable;
  }

  reset() {
    for (let i = 0; i < this.selectedPlatforms.length; ++i) {
      this.dataModel[this.selectedPlatforms[i]] = '';
    }
  }

  applyVerdicFilter(event) {
    if (event) {
      if (event.value == 'ANY') {
        this.subs = JSON.parse(JSON.stringify(this.submissions));
      } else {
        this.subs = [];
        this.selectedVerdict = event;
        for (let i = 0; i < this.submissions.length; ++i) {
          if (this.submissions[i]['verdict'] == this.selectedVerdict.value) {
            this.subs.push(this.submissions[i]);
          }
        }
      }
    } else {
      this.subs = JSON.parse(JSON.stringify(this.submissions));
    }
  }
}
