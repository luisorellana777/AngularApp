import { Component, OnInit, Inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {Comment} from '../shared/comment';
import { baseURL } from '../shared/baseurl';

import {Dish} from '../shared/dish';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
	
    formErrors = {
    'author': '',
    'comment': ''
  };
  
  validationMessages = {
    'author': {
      'required':      'Author Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.',
      'maxlength':     'Author cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 2 characters long.',
      'maxlength':     'Comment cannot be more than 25 characters long.'
    },
  };
  
  commentForm: FormGroup;
  
  dishIds: number[];
  prev: number;
  next: number;
  dish: Dish;
  comment: Comment;
  
  constructor(private dishService: DishService, 
  private route: ActivatedRoute,
  private location: Location, 
  private fb: FormBuilder,
  @Inject('BaseURL') private baseURL) { this.createForm(); }
  ngOnInit() {
    
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .switchMap((params: Params) => this.dishService.getDish(+params['id']))
      .subscribe(dish => {this.dish = dish; this.setPrevNext(dish.id); });
    
  }
  
    createForm() {
    this.commentForm = this.fb.group({
      rating: 5,
      comment: ['', [Validators.required, Validators.minLength(2), , Validators.maxLength(25)]], 
      author: ['', [Validators.required, Validators.minLength(2), , Validators.maxLength(25)]],
      date: ''
    });
     this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();//reset validation messages
  }
  
  onValueChanged(data?: any){
    if(!this.commentForm){return;}
    
    const form = this.commentForm;
    for(const field in this.formErrors){
      //clear previous error message
      this.formErrors[field] = '';
      const control = form.get(field);
      if(control && control.dirty && !control.valid){
        const messages = this.validationMessages[field];
        for(const key in control.errors){
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
  
  setPrevNext(dishId: number){
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
	  this.location.back();
  }
  
  onSubmit() {
    this.comment = this.commentForm.value;
    console.log(this.comment);
    this.commentForm.reset({
      rating: 5,
      comment: '',
      author: '',
      date: ''
    });
    this.comment.date = (new Date()).toString();
    this.dish.comments.push(this.comment);
  }
}
