import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

// 아래 @Injectable({providedIn: 'root'}) 을 안쓰려면 app.module.ts에 providers에 추가 해야 함
@Injectable({ providedIn: 'root' })
export class PostsService {
  // 이러한 방식이 외부에서 접근이 되지 않고, javascript의 외부에서 접근 못하게 막으며, 본래의 posts의 변수는 건들 수 없다고 한다.
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>(); // subject는 observable과 같다고 생각하면 된다.

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http.get<{ message: string, posts: any }>(
      'http://localhost:3000/api/posts'
    )
    .pipe(map((postData) => {
      return  postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath
        };
      });
    }))
    .subscribe(transformedPosts => {
      this.posts = transformedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // return {...this.posts.find(p => p.id === id)};
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title: title, content: content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        // 한가지의 post를 add하고 난 후, 새로 모든 리스트를 불러오는건 안좋은 생각이라고 강사는 말한다.
        // 더 좋은 방법으로는 DB에 등록된 1개의 값 중 id만 을 response 받는 것이 효율적이다 라고 함
        const id = responseData.post.id;
        post.id = id;
        this.posts.push(post);
        // 위에서 값을 넣고, observer들이 알 수 있도록 이벤트를 emit 한다.
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }


  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;

    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ''
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        // filter는 오직 posts의 부분집합으로
        // 결과가 참인 것만 array 담겨서 updatedPosts에 적용한다.
        // 대신 이 방법은 서버로 가지 않고, 로컬에서 데이터를 삭제하고 다시 보여주는 것이다.
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
