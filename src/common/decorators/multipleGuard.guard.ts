// eslint-disable-next-line prettier/prettier
import { CanActivate, ExecutionContext,	Injectable,	SetMetadata, Type } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';

@Injectable()
export class MultipleGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly moduleRef: ModuleRef,
	) { }

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const allowedGuardsHandlers =
			this.reflector.get<Type<CanActivate>[]>(
				'multipleGuardsReferences',
				context.getHandler(),
			) || [];

		const guards = allowedGuardsHandlers.map((guardReference) =>
			this.moduleRef.get<CanActivate>(guardReference),
		);

		if (guards.length === 0) {
			return Promise.resolve(true);
		}

		if (guards.length === 1) {
			return guards[0].canActivate(context) as Promise<boolean>;
		}

		return Promise.any(
			guards.map((guard) => {
				return guard.canActivate(context) as Promise<boolean>;
			}),
		);
	}
}