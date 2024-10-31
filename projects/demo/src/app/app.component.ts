import { JsonPipe } from '@angular/common';
import { Component, inject, model, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterOutlet } from '@angular/router';
import { NgxColorListComponent } from 'ngx-color-list';
import { Highlight, HighlightLoader } from 'ngx-highlightjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgxColorListComponent,
    ReactiveFormsModule,
    JsonPipe,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    Highlight,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly hljsLoader: HighlightLoader = inject(HighlightLoader);
  colorList = [...generarColoresHexUnicos(15)];
  formControl = new FormControl();
  formControlWithValues = new FormControl(this.colorList.slice(1, 3));
  colors = model<string[] | null>(null);
  colorsWithValues = model<string[] | null>(this.colorList.slice(1, 3));
  colorsWithDiffConfigs = model<string[] | null>(null);

  codeSnippeForFormControlHTML = `
    <ngx-color-list 
      [colors]="colorList"
      [formControl]="formControl"
    ></<ngx-color-list>
  `;

  codeSnippeForFormControlTS = `
    import { Component } from '@angular/core';
    import { NgxColorListComponent } from 'ngx-color-list';
    
    @Component({
      selector: 'app-root',
      standalone: true,
      imports: [
        NgxColorListComponent,
      ],
      templateUrl: './app.component.html',
      styleUrl: './app.component.scss',
    })
    export class AppComponent {
      colorList = [${this.colorList.slice(0, 4)}];
      formControl = new FormControl();
    }
  `;

  codeSnippeForFormControlWithDefailValuesHTML = `
    <ngx-color-list 
      [colors]="colorList"
      [formControl]="formControl"
    ></<ngx-color-list>
  `;

  codeSnippeForFormControlWithDefailValuesTS = `
    import { Component } from '@angular/core';
    import { NgxColorListComponent } from 'ngx-color-list';
    
    @Component({
      selector: 'app-root',
      standalone: true,
      imports: [
        NgxColorListComponent,
      ],
      templateUrl: './app.component.html',
      styleUrl: './app.component.scss',
    })
    export class AppComponent {
      colorList = [${this.colorList.slice(0, 4)}];
      formControl = new FormControl([${this.colorList.slice(1, 3)}]);
    }
  `;

  codeSnippeForModelHTML = `
    <ngx-color-list 
      [colors]="colorList" 
      [(value)]="colors" 
    ></<ngx-color-list>
  `;

  codeSnippeForModelTS = `
    import { Component, model } from '@angular/core';
    import { NgxColorListComponent } from 'ngx-color-list';
    
    @Component({
      selector: 'app-root',
      standalone: true,
      imports: [
        NgxColorListComponent,
      ],
      templateUrl: './app.component.html',
      styleUrl: './app.component.scss',
    })
    export class AppComponent {
      colorList = [${this.colorList.slice(0, 4)}];
      colors = model<string[] | null>(null);
    }
  `;

  codeSnippeForModelWithDefaultValuesHTML = `
    <ngx-color-list 
      [colors]="colorList" 
      [(value)]="colors" 
    ></<ngx-color-list>
  `;

  codeSnippeForModelWithDefaultValuesTS = `
    import { Component, model } from '@angular/core';
    import { NgxColorListComponent } from 'ngx-color-list';
    
    @Component({
      selector: 'app-root',
      standalone: true,
      imports: [
        NgxColorListComponent,
      ],
      templateUrl: './app.component.html',
      styleUrl: './app.component.scss',
    })
    export class AppComponent {
      colorList = [${this.colorList.slice(0, 4)}];
      colors = model<string[] | null>(${this.colorList.slice(1, 3)});
    }
  `;

  codeSnippeForWithDiferentConfigsHTML = `
    <ngx-color-list
      [colors]="colorList"
      [config]="{ height: '40px', width: '40px', borderRadius: '50%' }"
      [(value)]="colors"
    ></<ngx-color-list>
    
    <ngx-color-list
      [colors]="colorList"
      [config]="{ height: '40px', borderRadius: '25px' }"
      [(value)]="colors"
    ></<ngx-color-list>
    
    <ngx-color-list
      [colors]="colorList"
      [config]="{ width: '40px', borderRadius: '25px' }"
      [(value)]="colors"
    ></<ngx-color-list>
    
    <ngx-color-list
      [colors]="colorList"
      [config]="{ borderRadius: '0' }"
      [(value)]="colors"
    ></<ngx-color-list>
    
    <ngx-color-list
      [colors]="colorList"
      [config]="{ borderRadius: '10%' }"
      [(value)]="colors"
    ></<ngx-color-list>  
  `;

  codeSnippeForWithDiferentConfigsTS = `
    import { Component, model } from '@angular/core';
    import { NgxColorListComponent } from 'ngx-color-list';
    
    @Component({
      selector: 'app-root',
      standalone: true,
      imports: [
        NgxColorListComponent,
      ],
      templateUrl: './app.component.html',
      styleUrl: './app.component.scss',
    })
    export class AppComponent {
      colorList = [${this.colorList.slice(0, 4)}];
      colors = model<string[] | null>(null);
    }
  `;

  ngOnInit(): void {
    this.hljsLoader.setTheme(
      `//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css`
    );
  }
}

function generarColoresHexUnicos(numColores: number) {
  const colores = new Set(); // Usamos un Set para evitar duplicados

  while (colores.size < numColores) {
    let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    // Asegurarse de que el código hexadecimal tenga 6 caracteres
    while (color.length < 7) {
      color += '0';
    }
    colores.add(color); // Añadimos el color al Set (solo agrega si no existe)
  }

  return Array.from(colores) as string[]; // Convertimos el Set en un array
}
