import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-demo',
  template: `<h1>Hello</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoHusky {
  protected title = 'Husky Demo';
  protected count = 0;

  increment() {
    this.count++;
  }
}
