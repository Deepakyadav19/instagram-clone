import { LikeService } from './../services/like.service';
import { PostService } from "./../services/post.service";

import { SendHttpRequestService } from "./../send-http-request.service";
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  Injectable,
} from "@angular/core";

import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { jsonDecoder } from '../utils/jsonDecoder';
import { BufferToImage } from '../utils/bufferToImage';

@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-feed",
  templateUrl: "./feed.component.html",
  styleUrls: ["./feed.component.scss"],
})
export class FeedComponent implements OnInit {
  constructor(
    private sendReq: SendHttpRequestService,
    private PostService: PostService,
    private userService: SendHttpRequestService,
    private domSanitizer: DomSanitizer,
    private LikeService:LikeService,
    private dialog: MatDialog

  ) {}
  @ViewChild("modal", { static: false }) modal: ElementRef;
  @ViewChild("caption", { static: false }) caption: ElementRef;
  @ViewChild("commentarea", { static: false }) commentarea: ElementRef;
  show: Boolean = false;
  buttonName: String = "follow";
  follow() {
    this.show = !this.show;
    if (this.show) this.buttonName = "follow";
    else this.buttonName = "unfollow";
  }

  
  res: any;
  feed: any;
  liked : boolean = false
  operation : string = "inc"

  addcomment(text: string) {
    let commentObj = {
      ownerID: this.sendReq.jsonDecoder(localStorage.getItem("token")).data._id, //from token
      comment: this.commentarea.nativeElement.value,
    };

    console.log(commentObj);
    this.sendReq.commentPost(commentObj).subscribe((res) => (this.res = res));
    console.log(this.res);
  }

  openDialog() {
    this.dialog.open(ModalComponent, {
      data: {
        animal: 'panda'
      }
    });
  }

  ngOnInit() {
    this.loadPosts();
  }
  openModal() {
    this.modal.nativeElement.style.display = "flex";
  }

  closeModal() {
    this.modal.nativeElement.style.display = "none";
  }

  userInfo: any;
  bufferedImage: SafeUrl;

  postImages: any = [];
  loadPosts() {
    this.PostService.getFeed().subscribe((res) => {
      this.feed = res.payload.data.feedFinal;
      console.log(res, this.feed, "response feed");
      console.log(this.feed, "my feed");
      this.fillPostImages();
    });

    this.userService.userInfo(jsonDecoder().data._id, null).subscribe((res) => {
      console.log(res.body);
      this.userInfo = res.body.user;
      this.bufferedImage = BufferToImage.bufferToImage(res.body.bufferedImage, this.domSanitizer);
    })
  }

  fillPostImages() {
    this.feed.map((post: any, index: number) => {
      if (post.image) {
        let TYPED_ARRAY = new Uint8Array(post.image.data);

        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
          return data + String.fromCharCode(byte);
          }, '');
        
        let base64String = btoa(STRING_CHAR);
        
        this.postImages[index] = this.domSanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64, ` + base64String);
      }
      return null;
    });

  }

  like(postId){
    console.log("here")
    if (this.liked==false){
      this.operation = "inc"
      this.liked = true;
    }
    else{
        this.operation = "dec";
        this.liked = false;
    }

    this.LikeService.like(postId, this.operation).subscribe(res=>{
          let message = res.payload.message
          console.log(message, "message")
    })
  }

  reloadPosts(){
    console.log('inside reloadPosts');
    this.loadPosts();
  }

}
