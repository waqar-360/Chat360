import { HttpException } from '@nestjs/common';
import { ResponseCode } from '../enum';

export class Pagination {
  public static readonly limit_page_size: number = 100;

  /**
   * Apply pagination
   *
   * @param req
   * @param res
   * @returns
   */
  public static paginate(req): IPaginationOptions {
    let page: number;
    let pageSize: number;

    if (req.query.page !== undefined && Number(req.query.page) !== 0) {
      if (!Pagination.isPositiveInteger(req.query.page.toString())) {
        throw new HttpException(
          `Invalid value for parameter 'page': ${req.query.page.toString()}`,
          ResponseCode.BAD_REQUEST,
        );
      }
      page = Number(req.query.page.toString());
    } else page = 1;

    if (req.query.pageSize !== undefined) {
      if (!Pagination.isPositiveInteger(req.query.pageSize.toString())) {
        throw new HttpException(
          `Invalid value for parameter 'pageSize': ${req.query.pageSize.toString()}`,
          ResponseCode.BAD_REQUEST,
        );
      }
      pageSize = Number(req.query.pageSize.toString());
      if (pageSize > Pagination.limit_page_size) {
        throw new HttpException(
          `Page size cannot be a number greater than 100: ${pageSize}`,
          ResponseCode.BAD_REQUEST,
        );
      }
    } else pageSize = 10;

    const paginationOption: IPaginationOptions = {
      page,
      limit: pageSize,
    };
    return paginationOption;
  }

  /**
   * Check whether the string is a integer.
   *
   * @param value
   */
  public static isInteger(value: string): boolean {
    return /^[+\-]?([0-9]+)$/.test(value);
  }

  /**
   * Check whether the string is a positive integer.
   *
   * @param value
   */
  public static isPositiveInteger(value: string): boolean {
    return /^(\+)?([0-9]+)$/.test(value);
  }

  /**
   * Check whether the string is a negative integer.
   *
   * @param value
   */
  public static isNegativeInteger(value: string): boolean {
    return /^\-([0-9]+)$/.test(value);
  }
}

export interface IPaginationOptions {
  page: number;
  limit: number;
}
