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
  private users: Array<any>

  constructor(private http: HttpClient) {
    this.getAllUsers().subscribe(userData => {
      if (userData) {
        this.users = userData.members
        this.getAllPraises().subscribe(praiseData => {
          if (praiseData) {
            this.praises = this.enrichPraises(praiseData.allPraises)
          }
        })
      }
    })
  }

  ngOnInit() {
  }

  getAllPraises(): Observable<any> {
    return this.http.get('/api/praises')
  }

  getAllUsers(): Observable<any> {
    return this.http.get('/api/users')
  }

  enrichPraises(data) {
    data = this.addColors(data)
    data = this.addPhotos(data)
    data = this.addRealNames(data)
    return data
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

  addPhotos(data) {
    const that = this
    return data.map(d => {
      if (d.nominee !== '') {
        const nomineeProfile = that.users.find(user => {
          return user.name === d.nominee
        })
        if (nomineeProfile) {
          d.nomineePhotoUrl = nomineeProfile.profile.image_72
        }
      }
      return d
    })
  }

  addRealNames(data) {
    const that = this
    return data.map(d => {
      if (d.user_name !== '') {
        const userProfile = that.users.find(user => {
          return user.name === d.user_name
        })
        d.real_name = userProfile.real_name
      }
      return d
    })
  }

}
