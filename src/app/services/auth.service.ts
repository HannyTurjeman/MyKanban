import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import {switchMap} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User | null | undefined>;
  constructor(private angularFireAuth: AngularFireAuth, private angularFirestore:AngularFirestore) {
    this.user = this.angularFireAuth.authState.pipe(
      switchMap(auth => {
        if (auth) {
        return this.angularFirestore.doc(`users/${auth.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }

      )
    )
  }

  register() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.angularFireAuth.signInWithPopup(provider);
  }

  createUserDoc(user) {
    return this.angularFirestore.doc(`users/${user.uid}`).set({
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoUrl: user.photoURL,
      board: {
        todo: [],
        inProgress: [],
        review: [],
        completed: []
      }
    });
  }

  logOut() {
    this.angularFireAuth.signOut();
  }
}


