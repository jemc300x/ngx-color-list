import { NgClass, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';

export interface ColorConfig {
  height: string;
  width: string;
  borderRadius: string;
}

@Component({
  selector: 'color',
  standalone: true,
  imports: [NgClass, NgStyle],
  templateUrl: './color.component.html',
  styleUrl: './color.component.scss',
  host: {
    '[id]': 'id',
  },
})
export class ColorComponent implements AfterViewInit {
  static nextId = 0;
  readonly currentId = ColorComponent.nextId++;
  readonly id = `color-${this.currentId}`;
  readonly _isSelected = input<string[]>([], {
    alias: 'selectedList',
  });
  config = input<Partial<ColorConfig>>();
  color = input('');
  change = output<string>();
  isSelected = computed(() =>
    this._isSelected().some((c) => c === this.color())
  );
  readonly elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    const colorActual = this.color();
    const white = '#ffffff';
    const black = '#000000';
    const yellow = '#FFFF00';
    const isWhite = isColorSimilar(colorActual, white, 50);
    const isYellow = isColorSimilar(colorActual, yellow, 50);
    const className = `color-${this.color().slice(1)}`;

    this.elementRef.nativeElement.classList.add(className);

    this.elementRef.nativeElement.style.setProperty(
      '--currentColor',
      this.color()
    );
    this.elementRef.nativeElement.style.setProperty(
      '--checkColor',
      isWhite || isYellow ? black : white
    );

    if (this.config()?.height) {
      const height = this.config()?.height;
      this.elementRef.nativeElement.style.setProperty('--colorHeight', height);
    }

    if (this.config()?.width) {
      const width = this.config()?.width;
      this.elementRef.nativeElement.style.setProperty('--colorWidth', width);
    }

    if (this.config()?.borderRadius) {
      const borderRadius = this.config()?.borderRadius;
      this.elementRef.nativeElement.style.setProperty(
        '--borderRadius',
        borderRadius
      );
    }
  }

  onClick() {
    this.change.emit(this.color());
  }
}

// Función para convertir un color HEX a RGB
function hexToRgb(hex: any) {
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m: any, r: any, g: any, b: any) {
    return r + r + g + g + b + b;
  });

  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Función para convertir RGB a XYZ
function rgbToXyz({ r, g, b }: any) {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  r *= 100;
  g *= 100;
  b *= 100;

  return {
    x: r * 0.4124 + g * 0.3576 + b * 0.1805,
    y: r * 0.2126 + g * 0.7152 + b * 0.0722,
    z: r * 0.0193 + g * 0.1192 + b * 0.9505,
  };
}

// Función para convertir XYZ a LAB
function xyzToLab({ x, y, z }: any) {
  x /= 95.047;
  y /= 100.0;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  return {
    l: 116 * y - 16,
    a: 500 * (x - y),
    b: 200 * (y - z),
  };
}

// Función para calcular la diferencia Delta E entre dos colores LAB
function deltaE(lab1: any, lab2: any) {
  const deltaL = lab1.l - lab2.l;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;
  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
}

// Función para determinar si dos colores son iguales o similares
function isColorSimilar(currentColor: any, colorToDetect: any, tolerance = 5) {
  const rgb1 = hexToRgb(currentColor);
  const rgb2 = hexToRgb(colorToDetect);

  if (!rgb1 || !rgb2) {
    return false; // Si no se pueden convertir, devuelve false
  }

  const lab1 = xyzToLab(rgbToXyz(rgb1));
  const lab2 = xyzToLab(rgbToXyz(rgb2));

  const difference = deltaE(lab1, lab2);
  return difference <= tolerance;
}
