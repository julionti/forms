import { Cidade } from './../shared/models/cidade';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY, empty } from 'rxjs';
import { map, tap, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { DropdownService } from './../shared/services/dropdown.service';
import { EstadoBr } from './../shared/models/estado-br';
import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { FormValidations } from './../shared/form-validations';
import { VerificaEmailService } from './services/verifica-email.service';
import { BaseFormComponent } from './../shared/base-form/base-form.component';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  // formulario: FormGroup; // associado a <form [formGroup]="formulario">
  estados: EstadoBr[];
  // estados: Observable<EstadoBr[]>;
  cidades: Cidade[];

  cargos: any[];
  tecnologias: any[];
  newsletterOp: any[];
  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService
  ) {
    super();
  }

  ngOnInit(): void {

    // this.verificaEmailService.verificarEmail('email@email.com').subscribe();

    // pode ficar na memoria mesmo de pois de destruido o component
    /* this.dropdownService.getEstadosBr()
       .subscribe(dados => { this.estados = dados; console.log(dados);
       });*/
    // não precisa do subscribe nem do unsubscribe pois é async(no html)
    // this.estados = this.dropdownService.getEstadosBr(); // tirei o async do html
    this.dropdownService.getEstadosBr().
      subscribe(dados => this.estados = dados);


    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterOp = this.dropdownService.getNewsLetter();

    this.formulario = this.formBuilder.group({ // associado a <form [formGroup]="formulario">
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [null, [Validators.required, Validators.email], this.validarEmail.bind(this)], // bind define escopo local
      confirmarEmail: [null, FormValidations.equalTo('email')],
      // confirmarEmail: [null, FormValidations.equalTo('email123')],

      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),

      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      termos: [null, Validators.pattern('true')],
      frameworks: this.buldFrameworks()
    });

    // this.formulario.get('endereco.cep').valueChanges
    //   .subscribe(value => console.log('valor CEP:', value));
    this.formulario.get('endereco.cep').statusChanges
      .pipe(
        distinctUntilChanged(), // só passa daqui quando mudar o status
        tap(value => console.log('status CEP:', value)),
        switchMap(status => status === 'VALID' ? // só retorna um subscribe se status VALID
          this.cepService.consultaCEP(this.formulario.get('endereco.cep').value)
          : EMPTY
        )
      )
      .subscribe(dados => dados ? this.populaDadosForm(dados) : {}); // só executa se status VALID

    // testar cidades
    // this.dropdownService.getCidades(8).subscribe(console.log);

    this.formulario.get('endereco.estado').valueChanges
      .pipe(
        tap(estado => console.log('Novo estado:', estado)),
        map(estado => this.estados.filter(e => e.sigla === estado)),
        map(estados => estados && estados.length > 0 ? estados[0].id : EMPTY),
        switchMap((estadoId: number) => this.dropdownService.getCidades(estadoId)),
        tap(console.log)
      )
      .subscribe(cidades => this.cidades = cidades);
  }

  buldFrameworks() {
    // coloca false para todos os itens do array
    const values = this.frameworks.map(v => new FormControl(false));
    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(2));
  }

  submit() {
    console.log(this.formulario);

    let valueSubmit = Object.assign({}, this.formulario.value);
    // console.log(valueSubmit);
    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v, i) => v ? this.frameworks[i] : null).
        filter(v => v !== null)
    });
    // this.http.post('https://sshttpbin.org/post', JSON.stringify(this.formulario.value)) // testar erro
    this.http.post('https://httpbin.org/post', JSON.stringify(valueSubmit)) // rest test
      // .map(res => res)
      .subscribe(dados => {
        // console.log(dados);
        // reseta o form
        this.resetar();
      },
        (error: any) => alert('erro')); // url invalida por exemplo o formulario nao reseta
  }



  consultaCEP() {
    const cep = this.formulario.get('endereco.cep').value;
    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        .subscribe(dados => this.populaDadosForm(dados));
    }
  }

  populaDadosForm(dados) {
    // console.log(this.formulario);
    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        // cep: dados.cep,
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

  setarCargo() {
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl' };
    this.formulario.get('cargo').setValue(cargo);
  }

  CompararCargos(cargo1, cargo2) {
    return cargo1 && cargo2 ? (cargo1.nome === cargo2.nome && cargo1.nivel === cargo2.nivel) : cargo1 === cargo2;
  }

  setarTecnologias() {
    this.formulario.get('tecnologias').setValue(['java', 'php']);
  }

  getFrameworksControls() {
    // console.log((this.formulario.get('frameworks') as FormArray).controls);
    return this.formulario.get('frameworks') ? (this.formulario.get('frameworks') as FormArray).controls : null;
  }

  validarEmail(formControl: FormControl) {
    // console.log(this.verificaEmailService.verificarEmail(formControl.value));
    return this.verificaEmailService.verificarEmail(formControl.value)
      .pipe(map(emailExiste => emailExiste ? { emailInvalido: true } : null));

  }
}
