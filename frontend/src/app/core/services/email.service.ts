import { Injectable } from "@angular/core";
import { from } from "rxjs";
import emailjs from "@emailjs/browser";

@Injectable({
    providedIn: "root"
})
export class EmailService {
    private readonly serviceId = "service_ghwllkl";
    private readonly templateid = "template_06yst2t";
    private readonly publickey = "UDeyd973nxgS5hG4l";

    sendEmail(data: {
        name: string;
        email: string;
        message: string;
    }) {
        return from(
            emailjs.send(
                this.serviceId,
                this.templateid,
                data,
                {
                     publicKey: this.publickey
                }
            )
        );
    }   
}