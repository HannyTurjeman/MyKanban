import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import firestore = firebase.firestore;


@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private angularFirestore:AngularFirestore) { }


  addNewTask(userId, task) {
    this.angularFirestore.doc(`users/${userId}`).update({
      ['board.todo']: firestore.FieldValue.arrayUnion(task)
    });
  }

  saveBoard(userId, board) {
    return this.angularFirestore.doc(`users/${userId}`).update({
      ['board']: board
    });
  }


  removeTask(userId, task, taskColumn) {
    this.angularFirestore.doc(`users/${userId}`).update({
      [`board.${taskColumn}`]: firestore.FieldValue.arrayRemove(task)
    });
  }
}
