import { Router } from 'express';
import { playgroundController } from '../controllers/playgroundController';

const router = Router();

// Echo endpoint exposed for every common HTTP verb (great for method assertions).
router.get('/echo', playgroundController.echo);
router.post('/echo', playgroundController.echo);
router.put('/echo', playgroundController.echo);
router.patch('/echo', playgroundController.echo);
router.delete('/echo', playgroundController.echo);

router.get('/status/:code', playgroundController.status);
router.get('/delay/:ms', playgroundController.delay);
router.get('/random', playgroundController.random);
router.get('/flaky', playgroundController.flaky);
router.post('/flaky', playgroundController.flaky);

export default router;
