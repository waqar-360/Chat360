/*
 Copyright (c) 2023, Xgrid Inc, http://xgrid.co

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { PipeTransform, ArgumentMetadata } from '@nestjs/common';

export abstract class AbstractTransformPipe implements PipeTransform {
  protected abstract transformValue(value: any): any;

  protected except(): string[] {
    return [];
  }

  private isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }

  private transformObject(values) {
    Object.keys(values).forEach((key) => {
      if (this.except().includes(key)) {
        return;
      }

      if (this.isObject(values[key])) {
        values[key] = this.transformObject(values[key]);
      } else {
        values[key] = this.transformValue(values[key]);
      }
    });
    return values;
  }

  transform(values: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (this.isObject(values) && type === 'body') {
      return this.transformObject(values);
    }
    return values;
  }
}
