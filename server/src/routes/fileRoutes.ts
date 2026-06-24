import { Router } from 'express';
import { fileController } from '../controllers/fileController';
import { upload } from '../middleware/upload';
import { validate } from '../middleware/validate';
import { idParamSchema, listQuerySchema } from '../validators/common';

const router = Router();

router.post('/', upload.array('files', 10), fileController.upload);
router.get('/', validate({ query: listQuerySchema }), fileController.list);
router.get('/:id', validate({ params: idParamSchema }), fileController.get);
router.delete('/:id', validate({ params: idParamSchema }), fileController.remove);

export default router;
