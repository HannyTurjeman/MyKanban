import { CoreService } from './services/core.service';
import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';
import { Board, User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})
export class AppComponent {



  userMenuItems: any[] = [
    {
      icon: 'face',
      title: 'Profile',
      url: ''
    },
    {
      icon: 'dashboard',
      title: 'Board',
      url: ''
    }
  ]

kanbanBoard: Board = {
  todo: [],
  inProgress: [],
  review: [],
  completed: []
}

autoSaveTimerInterval;
autoSaveTimer: number = 0;

autoSaveTimeout;

user: any;

constructor(private snackBar: MatSnackBar, private authService:AuthService, private coreService:CoreService) {

  this.checkUser(null);
}

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  someMethod() {
    this.trigger.openMenu();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    this.autoSaveData();
  }

  autoSaveData() {

    if(this.autoSaveTimerInterval) {
      clearInterval(this.autoSaveTimerInterval);
      this.autoSaveTimer=0;
    };
    this.autoSaveTimerInterval = setInterval(() => {

      ++this.autoSaveTimer;

      if(this.autoSaveTimer >=100) {
        clearInterval(this.autoSaveTimerInterval);
        this.autoSaveTimer=0;
      }
    }, 50)


    if(this.autoSaveTimeout) clearTimeout(this.autoSaveTimeout);
    this.autoSaveTimeout = setTimeout(() => {
      this.saveData();
    }, 5000)


  }

  async saveData(task?) {
    if(task) {
      if(this.autoSaveTimeout) clearTimeout(this.autoSaveTimeout);
      if(this.autoSaveTimerInterval) {
        clearInterval(this.autoSaveTimerInterval);
        this.autoSaveTimer=0;
      };
      this.kanbanBoard.todo.push(task);
      this.autoSaveData();
    }

    else{
      await this.coreService.saveBoard(this.user.uid, this.kanbanBoard);
      this.snackBar.open('Saved Successfully', null, {duration: 1000});
    }



    // localStorage.setItem('kanban-board',JSON.stringify(this.kanbanBoard));

  }

  // importData() {
  //   if(localStorage.getItem('kanban-board')) {
  //     this.kanbanBoard = JSON.parse(localStorage.getItem('kanban-board'));
  //   }
  // }
  userSub:any;

   checkUser(userCred) {
    console.log(userCred);
    this.userSub = this.authService.user.subscribe(async (userDoc: any | null | undefined) => {
      if(userDoc === undefined) {
        //create user doc
        this.user = await this.authService.createUserDoc(userCred);
      } else {
        //get user doc or null
        this.user = userDoc;
        if(this.user !=null){
          this.kanbanBoard = userDoc.board;
        }
      }
    })
  }

  logIn() {
    if (this.userSub) { this.userSub.unsubscribe();}
    this.authService.register().then(credential => {
      this.checkUser(credential.user);
    });
  }

  logOut() {
    this.authService.logOut();
    this.kanbanBoard = {
      todo: [],
      inProgress: [],
      review: [],
      completed: []
    }
  }

  removeTask(task, column) {
    this.coreService.removeTask(this.user.uid, task, column)
  }
}

