// ChatService code with updated API paths and method implementations
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // Verify this path

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser.token}`,
      }),
    };
  }

  getChatUsers(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/api/chat-users`,
      this.getHttpOptions()
    );
  }

  getChatHistory(userId: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/api/chat-chats/${userId}`,
      this.getHttpOptions()
    );
  }

  sendChatMessage(
    userId: string,
    message: string,
    senderId: string
  ): Observable<any> {
    const body = {
      userId,
      chat: { message, time: new Date(), senderId: senderId },
    };
    return this.http.post(
      `${environment.apiUrl}/api/chat-chats/`,
      body,
      this.getHttpOptions()
    );
  }
}
