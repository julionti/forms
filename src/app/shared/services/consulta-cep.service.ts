import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }


  consultaCEP(cep: string) {

    cep = cep.replace(/\D/g, '');

    if (cep !== '') {
      const validacep = /^[0-9]{8}$/;

      if (validacep.test(cep)) {
        // Consulta o webservice viacep.com.br/
        // this.http.get('https://viacep.com.br/ws/' + cep + '/json');
        return this.http.get(`https://viacep.com.br/ws/${cep}/json`);
      }
    }
    // retorna vazio se cep inválido
    return of({});
  }

}
