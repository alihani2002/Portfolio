import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactMessageService, ContactMessageDto } from '../services/contact-message.service';

@Component({
  selector: 'app-contact-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-messages.html',
  styleUrl: '../projects-management/projects-management.css'
})
export class ContactMessages implements OnInit {
  private messageService = inject(ContactMessageService);

  messages = signal<ContactMessageDto[]>([]);
  selectedMessage = signal<ContactMessageDto | null>(null);
  isLoading = signal(false);
  error = signal('');

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.isLoading.set(true);
    this.messageService.getAll().subscribe({
      next: (data) => {
        this.messages.set(data.sort((a, b) => new Date(b.sentAt!).getTime() - new Date(a.sentAt!).getTime()));
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load messages');
        this.isLoading.set(false);
      }
    });
  }

  viewMessage(msg: ContactMessageDto) {
    this.selectedMessage.set(msg);
  }

  deleteMessage(id: number | undefined) {
    if (!id || !confirm('Permanently delete this message?')) return;

    this.messageService.delete(id).subscribe({
      next: () => {
        this.loadMessages();
        this.selectedMessage.set(null);
      },
      error: () => this.error.set('Failed to delete message')
    });
  }

  closeModal() {
    this.selectedMessage.set(null);
  }
}