interface Comment {
  commentId: number;
  commentDate: string;
  commentContent: string;
  userId: number;
  userName: string;
  userPicture: string;
}

interface Likes {
  LikesNumber: number;
  DislikesNumber: number;
  currentUserReaction: number;
}


export interface Post {
  postId: number;
  postDate: string;
  postContent: string;
  postImage: string;
  userId: number;
  userName: string;
  userPicture: string;
  likes: Likes;
  comments: [Comment];
}
