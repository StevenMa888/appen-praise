import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  private praises: Array<string>

  constructor(private http: HttpClient) {
    this.getAllPraises().subscribe(data => {
      if (data) {
        this.praises = data
      }
    })
  }

  ngOnInit() {
  }

  getAllPraises(): Observable<any> {
    return this.http.get('/api/praises')
  }

}
