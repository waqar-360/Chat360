import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/commons/type';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
})
export class LogInComponent implements OnInit {
  public user: User = {};
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  signIn() {
    this.authService.signInUser(this.user).subscribe(
      (res) => {
        console.log(res);
        localStorage.setItem('token', res['accessToken']);
        localStorage.setItem(
          'expiresAt',
          JSON.stringify(res['expiresAt'].valueOf()),
        );
        this.router.navigate(['/chats']);
      },
      (err) => {
        if (err.status === 400) {
          this.showErrorAlert();
        }
      },
    );
  }

  showErrorAlert() {
    Swal.fire('Oops!', 'Invalid email or password!', 'error');
  }
}
