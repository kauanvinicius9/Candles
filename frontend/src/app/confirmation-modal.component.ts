import { Component, ElementRef, ViewChild, input, output, effect } from "@angular/core";

@Component({
    selector: "app-confirmation-modal",
    standalone: true,
    templateUrl:  "./confirmation-modal.component.html",
    styleUrl: "./confirmation-modal.component.scss"
})
export class ConfirmationModalComponent {
    isOpen = input<boolean>(false);
    title = input<string>('Confirmação');
    message = input<string>('Deseja prosseguir?');

    confirmed = output<void>();
    cancelled = output<void>();

    @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;

    constructor() {
        effect(() => {
            if (this.isOpen()) {
                this.dialogRef?.nativeElement.showModal();
            } else {
                this.dialogRef?.nativeElement.close();
            }
        });
    }

    onConfirm(): void {
        this.confirmed.emit();
    }

    onCancel(): void {
        this.cancelled.emit();
    }
}