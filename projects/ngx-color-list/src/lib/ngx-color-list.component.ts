import { Component, effect, inject, input, model } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ColorComponent, ColorConfig } from './color/color.component';

@Component({
  selector: 'ngx-color-list',
  standalone: true,
  imports: [ColorComponent],
  template: `
    <div class="colors">
      @for (color of colors(); track $index) {
      <color
        color="{{ color }}"
        [config]="config()"
        [selectedList]="colorsSelected"
        (change)="onSelected($event)"
      />
      }
    </div>
  `,
  styles: `
  .colors {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  `,
})
export class NgxColorListComponent implements ControlValueAccessor {
  colors = input.required<string[]>();
  colorsSelected: string[] = [];
  readonly config = input<Partial<ColorConfig>>();
  readonly _value = model<string[] | null>(null, { alias: 'value' });
  readonly ngControl = inject(NgControl, { optional: true, self: true });
  onChange = (value: any) => {};
  onTouched = () => {};

  constructor() {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      const value = this._value();
      if (value) {
        this.colorsSelected = [...value];
      }
    });
  }

  onSelected(color: string) {
    const exist = this.colorsSelected.some((c) => c === color);
    if (exist) {
      this.colorsSelected = this.colorsSelected.filter((c) => c !== color);
    } else {
      this.colorsSelected.push(color);
    }
    const colors =
      this.colorsSelected.length > 0 ? [...this.colorsSelected] : null;
    this.ngControl?.control?.setValue(colors);
    this._value.set(colors);
  }

  writeValue(value: any): void {
    if (value) {
      this.colorsSelected = [...value];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}
}
