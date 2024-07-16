import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginFormSubmitted = false;
  loginFormErrorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.loginFormSubmitted = true;
    this.loginFormErrorMessage = '';

    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.router.navigate(['/user-table']);
            this.authService.login(formData).subscribe({
         next: () => {
         this.router.navigate(['/user-table']);
        },
        error: () => {
        this.loginFormErrorMessage = 'Erro de login. Verifique suas credenciais e tente novamente.';
       }
     });
    } else {
      this.loginFormErrorMessage = 'Preencha todos os campos.';
    }
  }
}
