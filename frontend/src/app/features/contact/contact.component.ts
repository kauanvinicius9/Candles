import { Component, signal } from '@angular/core';
import { EmailService } from "../../core/services/email.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})

export class ContactComponent {
  readonly submitted = signal(false);
  readonly sending = signal(false);
  readonly errorMessage = signal(false);

  readonly contactForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly emailService: EmailService
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  submit(): void {
    this.submitted.set(false);
    this.errorMessage.set(false);

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const data = this.contactForm.getRawValue();
    this.sending.set(true);

    this.emailService.sendEmail(data).subscribe({
      next: () => {
        this.submitted.set(true);
        this.sending.set(false);
        this.contactForm.reset();

        setTimeout(() => {
          this.submitted.set(false);
        }, 3000);
      },

      error: (error: any) => {
        this.sending.set(false);
        this.errorMessage.set(true);

        console.error("Erro ao enviar mensagem:", error);

        setTimeout(() => {
          this.errorMessage.set(false);
        }, 3000);
      }
    });
  }
}