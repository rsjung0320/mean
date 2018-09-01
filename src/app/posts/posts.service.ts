import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from './post.model';

// 아래 @Injectable({providedIn: 'root'}) 을 안쓰려면 app.module.ts에 providers에 추가 해야 함
@Injectable({providedIn: 'root'})
export class PostsService {
  // 이러한 방식이 외부에서 접근이 되지 않고, javascript의 외부에서 접근 못하게 막으며, 본래의 posts의 변수는 건들 수 없다고 한다.
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    return this.posts;
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost (title: string, content: string) {
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
