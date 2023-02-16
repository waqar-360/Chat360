import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'chat360';
  constructor(
    public authService: AuthService,
    private router: Router,
    private socketService: SocketService,
  ) {}

  ngOnInit() {
    this.authService.loggedIn()
      ? this.router.navigate(['/chats'])
      : this.router.navigate(['/login']);
  }
}
