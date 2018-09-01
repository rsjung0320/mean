import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', content: 'This is the first post\'s content'},
  //   {title: 'Second Post', content: 'This is the second post\'s content'},
  //   {title: 'Third Post', content: 'This is the third post\'s content'}
  // ];
  posts: Post[] = []; // post-create에서 @Output 한 것을 상위 app.component를 걸쳐서 받는다.
  private postsSub: Subscription; // observer와 같다고 생가하면 될 듯.

  constructor(public postsService: PostsService) {
  }

  ngOnInit() {

    // this.posts = this.postsService.getPosts();
    // 리스트이기 때문에 Observer가 되야 한다. 상황이 변경이 되면 첫번째, param에서 해당 내역을 처리하고, 두번째 param에서는 error를 세번째 param에는 완료 후 처리 로직이 들어간다.
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      // 200: Success
      this.posts = posts;
      console.log(`posts : `, posts);
    }, (err) => {
      // fail
      console.log(err);
    }, () => {
      // 200: Success,
      // TODO 좀 더 알아 볼 것, 후처리가 아니라, Observable이 자신을 종료, 소멸 했을 때, 이벤트를 emit 하는 것을 받아 주는 것 같다.
      console.log('Observable / Subject is over / the end');
    });
  }


  ngOnDestroy() {
    // Subscription 과 메모리 leak을 없앤다.
    this.postsSub.unsubscribe();
  }
}
