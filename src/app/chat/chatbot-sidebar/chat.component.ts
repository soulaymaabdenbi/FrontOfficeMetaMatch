import { Component, OnInit } from '@angular/core';

import { ChatService } from 'src/app/chat.service';
interface ChatMessage {
  text: string;
  senderId: string;
  timestamp: Date;
  recipientId?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  users: UserWithLatestMessage[] = [];
  messages: ChatMessage[] = [];
  selectedUser: any = null;
  newMessage: string = '';
  searchTerm: string = '';
  filteredUsers: UserWithLatestMessage[] = [];
  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadChatUsers();
  }

  loadChatUsers() {
    this.chatService.getChatUsers().subscribe(
      (users) => {
        this.users = users.map((user: any) => ({
          ...user,
        }));
        this.filteredUsers = this.users;
      },
      (error) => {
        console.error('Failed to fetch users:', error);
      }
    );
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter((user) =>
        user.fullname.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  selectUser(user: any): void {
    this.selectedUser = user;
    this.messages = [];

    this.loadChatHistory(user._id);
  }

  loadChatHistory(userId: string) {
    this.chatService.getChatHistory(userId).subscribe(
      (chats) => {
        if (chats.length > 0) {
          this.messages = chats[0].chatHistory.map((chat: any) => ({
            text: chat.message,
            senderId: chat.senderId,
            timestamp: chat.time,
          }));
        }
      },
      (error) => {
        console.error('Failed to fetch chat history:', error);
      }
    );
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const senderId = currentUser._id;

    const newMsg: ChatMessage = {
      text: this.newMessage,
      senderId: senderId,
      timestamp: new Date(),
      recipientId: this.selectedUser._id,
    };

    // Send the message using the chat service
    this.chatService
      .sendChatMessage(this.selectedUser._id, this.newMessage, senderId)
      .subscribe(
        (chat) => {
          // Push the new message to the messages array
          this.messages.push(newMsg);

          this.loadChatHistory(this.selectedUser._id);

          this.newMessage = '';
        },
        (error) => {
          console.error('Failed to send message:', error);
        }
      );
  }

  isMyMessage(messageSenderId: string): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return messageSenderId === currentUser._id;
  }
}

interface UserWithLatestMessage {
  _id: string;
  fullname: string;
  profile: string;
  latestMessage: string;
}
