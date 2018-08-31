import { Post } from './post.model';
import { Injectable } from '@angular/core';

// 아래 @Injectable({providedIn: 'root'}) 을 안쓰려면 app.module.ts에 providers에 추가 해야 함
@Injectable({providedIn: 'root'})
export class PostsService {
  // 이러한 방식이 외부에서 접근이 되지 않고, javascript의 외부에서 접근 못하게 막으며, 본래의 posts의 변수는 건들 수 없다고 한다.
  private posts: Post[] = [];

  getPosts() {
    return [...this.posts];
  }

  addPost (title: string, content: string) {
    const post: Post = {title: title, content: content};
    this.posts.push(post);
  }
}
