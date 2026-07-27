import { Component, Input, OnInit, signal, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { AvaliationService } from "../../core/services/avaliation.service";
import { Avaliation } from "../../core/models/avaliation.model";

function noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
  const isWhiteSpace = (control.value || "").trim().length === 0;
  return !isWhiteSpace ? null : { whitespace: true };
}

@Component({
  selector: "app-coments",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.scss"],
})
export class FeedbackComponent implements OnInit {
  @Input() productId!: number;

  avaliations = signal<Avaliation[]>([]);
  sending = signal(false);
  successMessage = signal("");
  errorMessage = signal("");

  feedbackForm: FormGroup;
  selectedStars = signal(5);

  constructor(
    private readonly fb: FormBuilder,
    private readonly avaliationService: AvaliationService
  ) {
    this.feedbackForm = this.fb.group({
      nameClient: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(100), noWhiteSpaceValidator]],
      feedback: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500), noWhiteSpaceValidator]],
    });
  }

  ngOnInit(): void {
    this.loadAvaliation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && !changes['productId'].firstChange) {
      this.loadAvaliation();
    }
  }

  get f() {
    return this.feedbackForm.controls;
  }

  loadAvaliation(): void {
    if (!this.productId) return;

    this.avaliationService.findByProduct(this.productId).subscribe({
      next: (dados) => {
        this.avaliations.set(dados);
      },
      error: () => {
        this.showError("Não foi possível carregar as avaliações");
      },
    });
  }

  selectStar(nota: number): void {
    this.selectedStars.set(nota);
  }

  submit(): void {
    this.clearMessages();

    if (this.feedbackForm.invalid) {
      this.feedbackForm.markAllAsTouched();
      return;
    }

    const rawData = this.feedbackForm.getRawValue();
    const newAvaliation: Avaliation = {
      nameClient: rawData.nameClient.trim(),
      feedback: rawData.feedback.trim(),
      stars: this.selectedStars(),
      productId: this.productId,
    };

    this.sending.set(true);
    this.avaliationService.sendAvaliation(newAvaliation).subscribe({
      next: (answer) => {
        this.sending.set(false);
        this.successMessage.set(answer || "Avaliação enviada com sucesso!");

        this.feedbackForm.reset();
        this.selectedStars.set(5);

        this.loadAvaliation();
        setTimeout(() => this.successMessage.set(""), 4000);
      },
      error: () => {
        this.sending.set(false);
        this.showError("Erro ao enviar avaliação");
      },
    });
  }

  private showError(msg: string): void {
    this.errorMessage.set(msg);
    setTimeout(() => this.errorMessage.set(""), 4000);
  }

  private clearMessages(): void {
    this.successMessage.set("");
    this.errorMessage.set("");
  }
}