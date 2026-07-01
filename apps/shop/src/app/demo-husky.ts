import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-demo',
  template: `<h1>Hello</h1>`,
})
export class DemoHusky {
  title = 'Husky Demo';
  count = 0;

  increment() {
    const a = 1;
    this.count++;
    console.log('console log ---> :', a);
  }
}
