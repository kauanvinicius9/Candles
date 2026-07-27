import { Component, signal } from '@angular/core';
import { EmailService } from "../../core/services/email.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

function noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
  const isWhiteSpace = (control.value || "").trim().length === 0;
  return !isWhiteSpace ? null : { whitespace: true };
}

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

  private readonly emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly emailService: EmailService
  ) {

    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), noWhiteSpaceValidator]],
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000), noWhiteSpaceValidator]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  submit(): void {
    this.submitted.set(false);
    this.errorMessage.set(false);

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const rawData = this.contactForm.getRawValue();

    const data = {
      name: rawData.name?.trim(),
      email: rawData.email?.trim(),
      message: rawData.message?.trim()
    };

    this.sending.set(true);

    this.emailService.sendEmail(data).subscribe({
      next: () => {
        this.submitted.set(true);
        this.sending.set(false);
        this.contactForm.reset();

        setTimeout(() => {
          this.submitted.set(false);
        }, 4000);
      },

      error: (error: any) => {
        this.sending.set(false);
        this.errorMessage.set(true);
        console.error("Erro ao enviar mensagem:", error);

        setTimeout(() => {
          this.errorMessage.set(false);
        }, 4000);
      }
    });
  }
}