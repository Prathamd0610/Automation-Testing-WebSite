import mongoose, { type Schema, type ToObjectOptions } from 'mongoose';

/**
 * Global Mongoose serialization plugin.
 *
 * Every document is serialized with a stable string `id` (mapped from `_id`) and
 * without the internal `__v` version key, matching the API contract the client
 * consumes (`{ id, ... }`). Any transform a schema already declares (e.g. the
 * `User` schema stripping `password`/`refreshTokenHash`) is preserved and run
 * first, so this plugin composes with — rather than overrides — existing rules.
 *
 * This module is side-effect only: importing it registers the global plugin.
 * It must be imported before any model is compiled, so both `app.ts` and the
 * test setup import it ahead of the route/model graph. Node's module cache makes
 * the registration idempotent.
 */
function applyIdSerialization(schema: Schema): void {
  const existing = (schema.get('toJSON') as ToObjectOptions | undefined) ?? {};
  const existingTransform =
    typeof existing.transform === 'function' ? existing.transform : undefined;

  schema.set('toJSON', {
    versionKey: false,
    transform(doc, ret, options) {
      const transformed = existingTransform ? existingTransform(doc, ret, options) : ret;
      const result = (transformed ?? ret) as Record<string, unknown>;
      if (result._id != null) {
        result.id = String(result._id);
        delete result._id;
      }
      return result;
    },
  });
}

mongoose.plugin(applyIdSerialization);
