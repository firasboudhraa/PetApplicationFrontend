import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


loginForm= new FormGroup({
  name : new FormControl('',[Validators.minLength(8),Validators.required]), 
  email: new FormControl('',[Validators.email,Validators.required]),
})
save(){
  console.log(this.loginForm.value);
  console.log(this.loginForm.valid);
  console.log(this.loginForm.get('name')?.errors);
  console.log(this.loginForm.get('email')?.errors);
  // Redirect to profile page if the form is valid
  if (this.loginForm.valid) {
    window.location.href = '/profile';
  }

  if (!this.loginForm.valid) {
    alert('Please fill in all required fields correctly.');
  }
}
}

