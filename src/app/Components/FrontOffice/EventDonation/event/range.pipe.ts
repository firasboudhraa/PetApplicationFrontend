import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {
  transform(total: number, start: number = 0): number[] {
    return Array(total).fill(0).map((_, i) => i + start);
  }
}