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
      email: [null, [Validators.required, Validators.email]]
    });
  }


  onSubmit() {
    console.log(this.formulario);

    // this.http.post('https://sshttpbin.org/post', JSON.stringify(this.formulario.value)) // testar erro
    this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value)) // rest test
      // .map(res => res)
      .subscribe(dados => {
        console.log('dados' + JSON.stringify(dados));
        // reseta o form
        this.resetar();
      },
        (error: any) => alert('erro')); // url invalida por exemplo o formulario nao reseta
  }

  resetar() {
    this.formulario.reset();
  }
}
