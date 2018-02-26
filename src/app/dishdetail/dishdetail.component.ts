import { Component, OnInit, Inject } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
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
  styleUrls: ['./dishdetail.component.scss'], 
  animations: [
    trigger('visibility', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
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
  dishcopy = null;
  comment: Comment;
  errMess: string;
  visibility = 'shown';
  
  constructor(private dishService: DishService, 
  private route: ActivatedRoute,
  private location: Location, 
  private fb: FormBuilder,
  @Inject('BaseURL') private baseURL) { this.createForm(); }
  
  ngOnInit() {
    
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
      .switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(+params['id']); })
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
          errmess => { this.dish = null; this.errMess = <any>errmess; });
    
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
    this.dishcopy.comments.push(this.comment);
    this.dishcopy.save().subscribe(dish => {this.dish = dish; console.log(this.dish);});
    
  }
}
