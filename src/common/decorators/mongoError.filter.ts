// eslint-disable-next-line prettier/prettier
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { MongooseError } from 'mongoose';


@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
	catch(exception: MongoError, host: ArgumentsHost) {
		// switch (exception.code) {
		//   case 11000:
		//   default: console.log(exception,'ALERT ERROR CATCHED');
		//     // duplicate exception
		//     // do whatever you want here, for instance send error to client
		// }
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		let error;

		switch (exception.name) {
			case 'DocumentNotFoundError': {
				error = {
					statusCode: HttpStatus.NOT_FOUND,
					message: "Not Found"
				}
				break;
			}
			// case 'MongooseError': { break; } // general Mongoose error
			// case 'CastError': { break; }
			// case 'DisconnectedError': { break; }
			// case 'DivergentArrayError': { break; }
			// case 'MissingSchemaError': { break; }
			// case 'ValidatorError': { break; }
			// case 'ValidationError': { break; }
			// case 'ObjectExpectedError': { break; }
			// case 'ObjectParameterError': { break; }
			// case 'OverwriteModelError': { break; }
			// case 'ParallelSaveError': { break; }
			// case 'StrictModeError': { break; }
			// case 'VersionError': { break; }
			default: {
				error = {
					statusCode: HttpStatus.BAD_REQUEST,
					message: (exception as Error).message
				}
				break;
			}
		}
		console.log('INSIDE')
		response.status(error.statusCode).json(error);
		//throw new HttpException((exception as Error).message, HttpStatus.BAD_REQUEST);
		//throe new BadRequestException((exception as Error).message);
	}
}
