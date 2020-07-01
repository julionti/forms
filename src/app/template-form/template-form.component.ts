import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConsultaCepService } from './../shared/services/consulta-cep.service';

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

  constructor(
    private http: HttpClient,
    private cepService: ConsultaCepService
  ) { }

  onSubmit(formulario) {
    console.log(formulario);
    console.log(this.usuario);

    this.http.post('https://httpbin.org/post', JSON.stringify(formulario.value)) // rest test
      // .map(res => res)
      .subscribe(dados => {
        console.log(dados);
        formulario.form.reset();
      }
      );
  }

  verificaValidTouched(campo) {
    return !campo.valid && campo.touched;
  }

  aplicaCssErro(campo) {
    return {
      'is-invalid': this.verificaValidTouched(campo)
      // 'has-feedback': this.verificaValidTouched(campo)
    };
  }

  consultaCEP(cep, form) {
    // console.log(cep);
    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        .subscribe(dados => this.populaDadosForm(dados, form));
    }
  }

  populaDadosForm(dados, formulario) {
    // formulario.setValue({
    //   nome: formulario.value.nome,
    //   email: formulario.value.email,
    //   endereco: {
    //     rua: dados.logradouro,
    //     cep: dados.cep,
    //     numero: '',
    //     complemento: dados.complemento,
    //     bairro: dados.bairro,
    //     cidade: dados.localidade,
    //     estado: dados.uf
    //   }
    // });
    console.log(formulario);
    formulario.form.patchValue({
      endereco: {
        rua: dados.logradouro,
        cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

  resetaDadosForm(formulario) {
    formulario.form.patchValue({
      endereco: {
        rua: null,
        cep: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

  ngOnInit(): void {
  }

}
