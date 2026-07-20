import { Injectable } from "@angular/core";
import { from } from "rxjs";
import emailjs from "@emailjs/browser";

@Injectable({
    providedIn: "root"
})
export class EmailService {
    private readonly serviceid = "service_ghwllkl";
    private readonly templateid = "template_o6yst2t";
    private readonly publickey = "_gywwE8Rq6W38f5Rn";

    sendEmail(data: {
        name: string;
        email: string;
        message: string;
    }) {
        return from(
            emailjs.send(
                this.serviceid,
                this.templateid,
                data,
                {
                     publicKey: this.publickey
                }
            )
        );
    }   
}