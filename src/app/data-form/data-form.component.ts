import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup; // associado a <form [formGroup]="formulario">

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient) { }

  ngOnInit(): void {

    this.formulario = this.formBuilder.group({ // associado a <form [formGroup]="formulario">
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [null, [Validators.required, Validators.email]],

      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    });
  }


  onSubmit() {
    console.log(this.formulario);

    if (this.formulario.valid) {
      // this.http.post('https://sshttpbin.org/post', JSON.stringify(this.formulario.value)) // testar erro
      this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value)) // rest test
        // .map(res => res)
        .subscribe(dados => {
          console.log(dados);
          // reseta o form
          this.resetar();
        },
          (error: any) => alert('erro')); // url invalida por exemplo o formulario nao reseta
    } else {
      console.log('Formulário inválido');
      this.verificaValidacoesForm(this.formulario);
    }
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      if (controle instanceof FormGroup){
        this.verificaValidacoesForm(controle);
      }
    }
    );
  }

  resetar() {
    this.formulario.reset();
  }

  verificaValidTouched(campo) {
    return (
      !this.formulario.get(campo).valid &&
      (this.formulario.get(campo).touched || this.formulario.get(campo).dirty)
    );
  }

  verificaEmailInvalido() {
    const campoEmail = this.formulario.get('email');
    if (campoEmail.errors) {
      return campoEmail.errors.email && campoEmail.touched;
    }
  }
  aplicaCssErro(campo: string) {
    return {
      'is-invalid': this.verificaValidTouched(campo),
      // 'is-valid': this.verificaValidTouched(campo)
      // 'has-error': this.verificaValidTouched(campo),
      // 'has-feedback': this.verificaValidTouched(campo)
    };
  }

  consultaCEP() {
    let cep = this.formulario.get('endereco.cep').value;

    cep = cep.replace(/\D/g, '');

    if (cep !== '') {
      const validacep = /^[0-9]{8}$/;

      if (validacep.test(cep)) {
        this.resetaDadosForm();
        // Consulta o webservice viacep.com.br/
        // this.http.get('https://viacep.com.br/ws/' + cep + '/json');
        this.http.get(`https://viacep.com.br/ws/${cep}/json`)
          // .map(dados => dados.json())
          .subscribe(dados => // console.log(dados)
            this.populaDadosForm(dados)
          );
      }
    }
    this.formulario.get('nome').setValue('Julio');
  }

  populaDadosForm(dados) {
    console.log(this.formulario);
    this.formulario.patchValue({
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

  resetaDadosForm() {
    this.formulario.patchValue({
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
}
