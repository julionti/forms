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
      cep: [null, Validators.required],
      numero: [null, Validators.required],
      complemento: [null],
      rua: [null, Validators.required],
      bairro: [null, Validators.required],
      cidade: [null, Validators.required],
      estado: [null, Validators.required],
    });
  }


  onSubmit() {
    console.log(this.formulario);

    // this.http.post('https://sshttpbin.org/post', JSON.stringify(this.formulario.value)) // testar erro
    this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value)) // rest test
      // .map(res => res)
      .subscribe(dados => {
        console.log(dados);
        // reseta o form
        this.resetar();
      },
        (error: any) => alert('erro')); // url invalida por exemplo o formulario nao reseta
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
}
