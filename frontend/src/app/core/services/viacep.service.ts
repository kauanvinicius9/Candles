import { Injectable, inject } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ViaCepResponse {
  cep: string;
  street: string;
  complement: string;
  neighborhood: string;
  location: string;
  uf: string;
  error?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  private http = inject(HttpClient);

  getCep(cep: string): Observable<ViaCepResponse> {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return throwError(() => new Error('CEP deve conter 8 dígitos.'));
    }

    return this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${cleanCep}/json/`).pipe(
      map(response => {
        if (response.error) {
          throw new Error('CEP não encontrado.');
        }
        return response;
      }),
      catchError(error => throwError(() => new Error(error.message || 'Erro ao buscar CEP.')))
    );
  }
}