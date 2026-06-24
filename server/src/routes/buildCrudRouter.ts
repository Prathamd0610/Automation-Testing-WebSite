import { Router } from 'express';
import type { AnyZodObject, ZodEffects } from 'zod';
import type { CrudController } from '../controllers/crudControllerFactory';
import { validate } from '../middleware/validate';
import { idParamSchema, listQuerySchema } from '../validators/common';

type Schema = AnyZodObject | ZodEffects<AnyZodObject>;

interface CrudRouterConfig {
  controller: CrudController;
  createSchema: Schema;
  updateSchema: Schema;
}

/**
 * Assembles a conventional REST router (list/get/create/update/delete) wired with
 * Zod validation. Mutating routes can be guarded by passing middleware in `guards`.
 */
export function buildCrudRouter(config: CrudRouterConfig, guards = { write: [] as never[] }): Router {
  const router = Router();
  const { controller, createSchema, updateSchema } = config;

  router.get('/', validate({ query: listQuerySchema }), controller.list);
  router.get('/:id', validate({ params: idParamSchema }), controller.get);
  router.post('/', ...guards.write, validate({ body: createSchema }), controller.create);
  router.put(
    '/:id',
    ...guards.write,
    validate({ params: idParamSchema, body: updateSchema }),
    controller.update,
  );
  router.patch(
    '/:id',
    ...guards.write,
    validate({ params: idParamSchema, body: updateSchema }),
    controller.update,
  );
  router.delete('/:id', ...guards.write, validate({ params: idParamSchema }), controller.remove);

  return router;
}
