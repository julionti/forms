import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import 'rxjs/add/operator/map';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    // nome: 'https://www.the-art-of-web.com/html/html5-form-validation/',
    nome: null,
    email: null
  };

  constructor(private http: HttpClient) { }

  onSubmit(form) {
    console.log(form);
    console.log(this.usuario);
  }

  verificaValidTouched(campo) {
    return !campo.valid && campo.touched;
  }

  aplicaCssErro(campo) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    };
  }

  consultaCEP(cep) {
    // console.log(cep);
    // Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');
    // Verifica se campo cep possui valor informado.
    if (cep !== '') {
      // Expressão regular para validar o CEP.
      const validacep = /^[0-9]{8}$/;
      // Valida o formato do CEP.
      if (validacep.test(cep)) {
        // Consulta o webservice viacep.com.br/
        this.http.get('https://viacep.com.br/ws/' + cep + '/json');
        this.http.get(`https://viacep.com.br/ws/${cep}/json`)
          // .map(dados => dados.json())
          .subscribe(dados => console.log(dados));

      }

    }
  }

  ngOnInit(): void {
  }

}
