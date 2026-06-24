import type { Request, Response } from 'express';
import { testDataService } from '../services/testDataService';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';

export const testDataController = {
  generate: asyncHandler(async (req: Request, res: Response) => {
    const { kind, count } = req.body;
    const result = await testDataService.generate(kind, count, req.user?.email);
    sendSuccess(
      res,
      { data: result, message: `Generated ${result.created} ${result.kind}` },
      201,
    );
  }),
};
