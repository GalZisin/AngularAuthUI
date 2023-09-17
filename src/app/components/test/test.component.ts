import { Component, Input } from '@angular/core';
import { Observe } from '../dashboard/observe';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  @Input() prop!: any
  @Observe("prop") private prop$!: Observable<any>;

  result$ = this.prop$.pipe(
    switchMap((prop) => {
      return prop;
    })
  )
}
