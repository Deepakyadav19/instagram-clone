import { FeedComponent } from './../feed/feed.component';
import { SendHttpRequestService } from './../send-http-request.service';
import { ProfileDashboardComponent } from './../profile-dashboard/profile-dashboard.component';
import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { jsonDecoder } from '.././utils/jsonDecoder';


@Component({
  selector: 'app-homenav',
  templateUrl: './homenav.component.html',
  styleUrls: ['./homenav.component.css']
})
export class HomenavComponent  implements OnInit {
  users$: Observable<any[]>;
  private searchTerms = new Subject<string>();

  isVisible:boolean = false;
  valuee:string="";
  
  constructor(private sendReq: SendHttpRequestService, private _router:Router, 
    private profileDashboard: ProfileDashboardComponent,
    private FeedComponent: FeedComponent
    
    ) { }

  // Push a search term into the observable stream. 
  search(term: string): void {
    this.searchTerms.next(term);
    this.isVisible=true;
   }
  res:any;

  ngOnInit(){
    // document.addEventListener('click',this.func);
    this.searchTerms.pipe(
      
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.sendReq.searchUsers(term)
    )).subscribe(res => {
      console.log(res, 'response inseide searchTerms pipe call');
      this.users$ = res;  
    });
    // console.log(this.users$, "usersssssssssss")
    
  }

  feed(){
    this.FeedComponent.loadPosts();
  }

  myProfile(){
    
    let instaHandle = jsonDecoder().data.instaHandle;
    let loggedinUserId = jsonDecoder().data._id;
    this._router.navigate(["/profile", instaHandle]);
    this.profileDashboard.loadUserData(loggedinUserId,null);
  }

  searchUser(userId:string){
    this.profileDashboard.loadUserData(userId, null)
    console.log(userId);
  }
  
  // close(){
  //   this.isVisible=false;
  // }

func(event){  
 
  var box = document.querySelector(".boxes");

  console.log(box,event.target,  "my boxxxx")
  // this.isVisible = box.contains(event.target)

  if (box.contains(event.target)){
    this.isVisible = true
  }
  else{
    this.isVisible = false
  }
  console.log(this.isVisible, "valueee")
  console.log(box.contains(event.target),"hhhhhh");

}
onBlur(){
  setTimeout(() =>{
    this.isVisible=false;
    this.valuee="";
  },1000)
  
}


}
