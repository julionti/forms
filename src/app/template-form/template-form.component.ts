import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: 'https://www.the-art-of-web.com/html/html5-form-validation/',
    email: 'julio@email.com'
  };

  onSubmit(form) {
    console.log(form);
    console.log(this.usuario);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
