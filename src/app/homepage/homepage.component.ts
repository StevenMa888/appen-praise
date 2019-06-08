import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  private praises: Array<any>

  constructor(private http: HttpClient) {
    this.getAllPraises().subscribe(data => {
      if (data) {
        this.praises = this.addColors(data.allPraises)
      }
    })
  }

  ngOnInit() {
  }

  getAllPraises(): Observable<any> {
    return this.http.get('/api/praises')
  }

  addColors(data) {
    return data.map(d => {
      d.blockColor = this.getRandomColor()
      return d
    })
  }

  getRandomColor() {
    const r = Math.floor(Math.random()*255)
    const g = Math.floor(Math.random()*255)
    const b = Math.floor(Math.random()*255)
    const opacity = 0.6
    const color = 'rgba('+ r +','+ g +','+ b +',' + opacity +')'
    return color
  }

}
