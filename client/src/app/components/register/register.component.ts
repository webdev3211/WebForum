import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

declare var $: any;


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // form: FormGroup; //type of FormGroup 
  form: FormGroup;
  message;
  messageClass;
  processing = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router


  ) {
    this.createForm();
  }

  // Function to validate e-mail is proper format
  validateEmail(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Test email against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid email
    } else {
      return { 'validateEmail': true } // Return as invalid email
    }
  }


  // Funciton to ensure passwords match
  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      // Check if both fields are the same
      if (group.controls[password].value === group.controls[confirm].value) {
        return null; // Return as a match
      } else {
        return { 'matchingPasswords': true } // Return as error: do not match
      }
    }
  }


  // Function to create registration form
  createForm() {
    this.form = this.formBuilder.group({
      // Email Input
      email: ['', Validators.compose([
        Validators.required, // Field is required
        this.validateEmail // Custom validation
      ])],

      // Name Input
      name: ['', Validators.required], // Field is required

      // Password Input
      password: ['', Validators.required],

      // Confirm Password Input
      confirm: ['', Validators.required] // Field is required
    },
      { validator: this.matchingPasswords('password', 'confirm') }); // Add custom validator to form for matching passwords
  };


  // Function to disable the registration form
  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['name'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
  }

  // Function to enable the registration form
  enableForm() {
    this.form.controls['email'].enable();
    this.form.controls['name'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
  }



  onRegisterSubmit() {
    this.processing = true;
    this.disableForm();
    const user = {
      email: this.form.get('email').value,
      name: this.form.get('name').value,
      password: this.form.get('password').value
    }

    this.authService.registerUser(user).subscribe(data => {

      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableForm();
      } else {


        this.messageClass = 'alert alert-success';
        this.message = data.message;
        // After 2 second timeout, navigate to the login page
        setTimeout(() => {
          this.router.navigate(['/login']); // Redirect to login view
        }, 2000);

      }

    });

  }

  ngOnInit() {

    $(document).ready(function () {
      $("#rightsidebar").hide();

      $('#rightdiv').hide();
      $('#leftdiv').hide();
      $(".vr").hide();
      $('#centerdiv').removeClass('col-md-7').addClass('col-md-12');
    });

  }



}

