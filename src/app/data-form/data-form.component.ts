import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient) { }

  ngOnInit(): void {

    this.formulario = this.formBuilder.group({ // assiciado a <form [formGroup]="formulario">
      nome: null,
      email: null
    });
  }


  onSubmit() {
    console.log('a' + this.formulario.value);

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
}
