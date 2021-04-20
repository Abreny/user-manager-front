import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/service/user.service';

export interface UserForm {
  nom: string,
  prenom: string,
  email: string
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  @Output() submitted = new EventEmitter<any>();
  @Input()
  get user() { return this._user; }
  set user(user) {
    this._user = user;
    if (this._user) {
      this.userForm.patchValue({
        nom: this._user.nom,
        prenom: this._user.prenom,
        email: this._user.email
      });
    }
  }
  private _user: any;

  constructor(private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      nom: [null, [Validators.required, Validators.maxLength(255)]],
      prenom: [null, [Validators.maxLength(255)]],
      email: [null, [Validators.required, Validators.email, Validators.pattern('.+\\.[a-zA-Z0-9]+$'), Validators.maxLength(255)]],
    });
   }

  ngOnInit(): void {

  }

  isFieldInvalid(field: string) {
    let fieldError = this.userForm.get(field);
    if (!fieldError) {
      return false;
    }
    return !fieldError.valid && fieldError.touched;
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.submitted.emit({
        user: this._user,
        form: this.userForm.value
      });
      this.userForm.reset();
      this._user = undefined;
    } else {
      Object.keys(this.userForm.controls).forEach(field => {
        const control = this.userForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
}
