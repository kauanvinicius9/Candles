import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Avaliation } from "../models/avaliation.model";

@Injectable({
    providedIn: "root"
})
export class AvaliationService {
    private readonly apiUrl = "http://localhost:8081/api/avaliacoes";

    constructor(private http: HttpClient) {}

    findByProduct(productId: number): Observable<Avaliation[]> {
        return this.http.get<Avaliation[]>(`${this.apiUrl}/produto/${productId}`);
    }

    sendAvaliation(avaliation: Avaliation): Observable<string> {
        return this.http.post(`${this.apiUrl}`, avaliation, { responseType: "text" });
    }
}