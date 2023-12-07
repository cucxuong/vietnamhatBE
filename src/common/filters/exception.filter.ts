import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ExceptionFilterHandler implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus?.() || 500;
    const exceptionResponse = exception.getResponse?.();

    response
      .status(status)
      .json(
        exceptionResponse || { message: exception.message, statusCode: status },
      );
  }
}
