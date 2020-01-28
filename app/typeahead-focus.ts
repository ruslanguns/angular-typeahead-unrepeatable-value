import {Component, OnInit, ViewChild, ViewEncapsulation, ElementRef} from '@angular/core';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject, merge} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import {NgbTypeaheadConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-typeahead-focus',
  templateUrl: './typeahead-focus.html',
  styles: [`
  // .form-control { width: 300px; }
  .dropdown-menu { width: 90%; box-sizing: border-box;}
  `],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbTypeaheadConfig]
})
export class NgbdTypeaheadFocus implements OnInit {
  materias = ['filosofia', 'matemáticas', 'español'];
  model: any;

  formatter = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

  @ViewChild('elemento', {static: true}) elemento: ElementRef
  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.materias : this.materias.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 5))
    );
  }


  constructor(config: NgbTypeaheadConfig) {
    // customize default values of typeaheads used by this component tree
    config.showHint = true;
    config.editable = true;
    config.focusFirst = true;
    let miArray: string[] = ['filosofia', 'matemáticas', 'español'];
  }

  ngOnInit() {
  }

  onSubmit(): void {
    if (this.model) {
    console.log(`Se ha ha añadido la materia. ${this.model}`);
    this.materias = this.setToArray(this.materias, this.model);
    this.model = '';
    }
  }


  /**
   * Solo válido para array de strings */
  setToArray(array: string[], newValue: string): string[] {
    let s = new Set();
    array.map(v => s.add(v));
    s.add(newValue.toLowerCase())
    return Array.from(s) as string[]
  }

  getWidthFromElement(): number {
    return this.elemento.nativeElement.offsetHeight;
  }

  pintar(e) {
    console.log(e);
  }

}
