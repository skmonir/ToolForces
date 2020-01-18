import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contests',
  templateUrl: './contests.component.html',
  styleUrls: ['./contests.component.css']
})
export class ContestsComponent implements OnInit {
  contests = [];
  dataSource: any;
  platforms: string[] = [
    'atcoder', 'codechef', 'codeforces', 'csacademy', 'hackerearth',
    'hackerrank', 'leetcode', 'topcoder'
  ];
  platformLink = {
    'atcoder': 'https://atcoder.jp/',
    'codechef': 'https://www.codechef.com/',
    'codeforces': 'https://codeforces.com/',
    'csacademy': 'https://csacademy.com/',
    'hackerearth': 'https://www.hackerearth.com/',
    'hackerrank': 'https://www.hackerrank.com/',
    'leetcode': 'https://leetcode.com/',
    'topcoder': 'https://www.topcoder.com/'
  }

  currentTime: number;

  constructor(private service: DataService, private titleService: Title) {
    this.getContestList();
  }

  ngOnInit() {
    this.titleService.setTitle(`Contests | ToolForces`);
  }

  getContestList() {
    this.service.getContestList().subscribe(response => {
      this.currentTime = new Date().getTime() / 1000;
      this.dataSource = response['results']['upcoming'];
      for (let i = 0; i < response['results']['ongoing'].length; ++i) {
        if (this.platforms.includes(response['results']['ongoing'][i].platform)) {
          if (response['results']['ongoing'][i].endTime > this.currentTime) {
            this.contests.push(response['results']['ongoing'][i]);
            this.contests[this.contests.length - 1].timeLeft = this.getLeftTime(response['results']['ongoing'][i].startTime, response['results']['ongoing'][i].endTime);
          }
        }
      }
      for (let i = 0; i < response['results']['upcoming'].length; ++i) {
        if (this.platforms.includes(response['results']['upcoming'][i].platform)) {
          if (response['results']['upcoming'][i].endTime > this.currentTime) {
            this.contests.push(response['results']['upcoming'][i]);
            this.contests[this.contests.length - 1].timeLeft = this.getLeftTime(response['results']['upcoming'][i].startTime, response['results']['upcoming'][i].endTime);
          }
        }
      }
    });
  }

  getStartTime(epoch: number) {
    let d = new Date(0);
    d.setUTCSeconds(epoch);
    let t = "" + d;
    t = t.substring(0, 31);
    t = t.substring(0, 3) + ',' + t.substring(3);
    t = t.substring(0, 8) + '-' + t.substring(9);
    t = t.substring(0, 11) + '-' + t.substring(12);
    t = t.substring(0, 16) + ',' + t.substring(16);
    return t;
  }

  getDuration(startTime: number, endTime: number) {
    let diff = endTime - startTime;
    let hours = Math.floor(diff / 3600);
    let mins = Math.floor((diff % 3600) / 60);
    let days = Math.floor(hours / 24);
    hours = hours % 24;

    let ret = ("0" + hours).slice(-2) + ':' + ("0" + mins).slice(-2);
    if (days > 0) {
      ret = "" + days + ":" + ret;
    }
    return ret;
  }

  getLeftTime(startTime: number, endTime: number) {
    let currentTime = new Date().getTime() / 1000;
    let timeLeft = currentTime >= startTime ? endTime - currentTime : startTime - currentTime;
    return timeLeft;
  }

  isRunning(startTime: number) {
    let d1 = new Date(0);
    d1.setUTCSeconds(startTime);

    let d2 = new Date();

    return +d2 >= +d1;
  }

  getContestLink(platform: string, url: string) {
    if (platform == 'atcoder') {
      url = 'https://atcoder.jp' + url;
    }
    return url;
  }
}
