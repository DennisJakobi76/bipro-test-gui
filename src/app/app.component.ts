import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { CustomerDataComponent } from "./customer-data/customer-data.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CustomerDataComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'bipro-test-gui';
}
