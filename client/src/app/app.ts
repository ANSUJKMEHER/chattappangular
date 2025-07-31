import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { io } from 'socket.io-client';

interface ChatMessage {
  user: string;
  text: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, EmojiModule,PickerModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'client';

  // Socket connection (replace IP with actual server IP if needed)
  socket = io('https://chattappangular.onrender.com');

  // Signals for reactive state
  messages = signal<ChatMessage[]>([]);
  userId = '';
  // message = ''; // Removed duplicate declaration
  joined = false;
  showPicker = false;

  constructor() {
    this.socket.on('message', (data: ChatMessage) => {
      this.messages.update((msgs) => [...msgs, data]);
    });
  }

  joinChat() {
    if (this.userId.trim()) {
      this.socket.emit('join', this.userId);
      this.joined = true;
    }
  }

  sendMessage() {
    if (this.message.trim()) {
      this.socket.emit('sendMessage', {
        user: this.userId,
        text: this.message,
      });
      this.message = '';
      this.showPicker = false; 
    }
  }

name = 'Angular';
  message = '';
  showEmojiPicker = false;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  set: "" | "apple" | "google" | "twitter" | "facebook" = "twitter";
  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
        this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event:any) {
    console.log(this.message)
    const { message } = this;
    console.log(message);
    console.log(`${event.emoji.native}`)
    const text = `${message}${event.emoji.native}`;

    this.message = text;
    // this.showEmojiPicker = false;
  }

  onFocus() {
    console.log('focus');
    this.showEmojiPicker = false;
  }
  onBlur() {
    console.log('onblur')
  }
}

