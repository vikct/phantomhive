import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="app-footer">
      <p>&copy; 2025 PhantomHive. All rights reserved.</p>
    </footer>
  `,
  styles: `
    :host {
    display: block;
    padding: 1rem;
    text-align: center;
    border-top: 1px solid var(--tui-border-normal);
    background-color: var(--tui-background-base-alt);
    color: var(--tui-text-secondary);
    font-size: 0.875rem;
  }`,
})
export class FooterComponent {}
