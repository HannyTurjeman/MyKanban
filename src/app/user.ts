export interface User {
  uid: string;
  name: string;
  email: string;
  photoUrl: string;
  board: Board;
}

export interface Board {
  todo: string[];
  inProgress: string[];
  review: string[];
  completed: string[];
}
