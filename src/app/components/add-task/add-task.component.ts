import { CoreService } from './../../services/core.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  @Input() user: any;
  @Output() onSave$ = new EventEmitter(null);
  addTaskForm: FormGroup;

  constructor(private formBuilder:FormBuilder, private coreService: CoreService) { }

  ngOnInit(): void {
    this.addTaskForm = this.formBuilder.group({
      task: ['',Validators.required]
    })
  }

  addTask() {
    const task = this.addTaskForm.value.task;
    // this.coreService.addNewTask(this.user.uid, task);
    this.onSave$.emit(task);
    this.addTaskForm.reset();

  }

}
