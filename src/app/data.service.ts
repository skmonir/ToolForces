import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }


  getContestList() {
    return this.http.get('/api/get.all.contests');
  }

  getAllHandles(): Observable<string[]> {
    return this.http.get<string[]>('../assets/files/handles.json');
  }

  getAllUvaProbs() {
    return this.http.get('../assets/files/uva_probs.json');
  }
  
  callCodeForcesApi(codeforcesApiUrl: string) {
    return this.http.get(codeforcesApiUrl);
  }

  getTophUserRating(user: string) {
    return this.http.get(`/api/toph.user.rating/${user}`);
  }

  getUVaSubmissions(user: string) {
    return this.http.get(`https://uhunt.onlinejudge.org/api/subs-user/${user}`);
  }

  getTophUserId(user: string) {
    return this.http.get(`/api/toph.user.id/${user}`);
  }

  getTophSubmissions(userId: string, start: number) {
    return this.http.get(`/api/toph.user.submissions/${userId}/${start}`);
  }

  getSpojSubsPages(user: string) {
    return this.http.get(`/api/spoj.user.check/${user}`);
  }

  getSpojSubmissions(user: string, start: number) {
    return this.http.get(`/api/spoj.user.submissions/${user}/${start}`);
  }
}
