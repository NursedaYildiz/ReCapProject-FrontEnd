import { Pipe, PipeTransform } from '@angular/core';
import { CarDetail } from '../models/carDetail';

@Pipe({
  name: 'carFilter'
})
export class CarFilterPipe implements PipeTransform {

  transform(value: CarDetail[], filterText:string): CarDetail[] {
    filterText = filterText ? filterText.toLocaleLowerCase(): ""

    return filterText ? value.filter((c:CarDetail) => 
    `${c.brandName} ${c.descriptions} ${c.modelYear}`.toLocaleLowerCase().indexOf(filterText) !== -1): value;
  }

}
