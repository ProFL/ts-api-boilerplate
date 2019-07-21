import {NextFunction, Request, Response} from 'express';
import 'reflect-metadata';
import ControllerBase from '../../../src/controllers/controller-base';
import {
  Delete,
  Get,
  Middleware,
  Patch,
  Post,
  Put,
} from '../../../src/decorators/controller';

export class TestController extends ControllerBase {
  constructor() {
    super('/test');
  }

  dummyMethod(): string {
    return 'dummy';
  }

  @Get('/single-middleware')
  @Middleware((_req: Request, res: Response, next: NextFunction) => {
    res.header('X-Middlewared', 'true');
    next();
  })
  singleMiddlewareTest(req: Request, res: Response) {
    res.json({path: req.path, method: req.method.toLowerCase()});
  }

  @Get('/multi-middleware')
  @Middleware((req: Request, _res: Response, next: NextFunction) => {
    req.body = ['1'];
    next();
  })
  @Middleware((req: Request, _res: Response, next: NextFunction) => {
    req.body = [...req.body, '2'];
    next();
  })
  @Middleware([
    (req: Request, _res: Response, next: NextFunction) => {
      req.body = [...req.body, '3'];
      next();
    },
    (req: Request, _res: Response, next: NextFunction) => {
      req.body = [...req.body, '4'];
      next();
    },
  ])
  multiMiddlewareTest(req: Request, res: Response) {
    res
      .header('X-Middlewared', req.body.join(''))
      .json({path: req.path, method: req.method.toLowerCase()});
  }

  @Get('/')
  getTest(req: Request, res: Response): void {
    res.json({path: req.path, method: req.method.toLowerCase()});
  }

  @Post('/')
  postTest(req: Request, res: Response): void {
    res.json({path: req.path, method: req.method.toLowerCase()});
  }

  @Put('/')
  putTest(req: Request, res: Response): void {
    res.json({path: req.path, method: req.method.toLowerCase()});
  }

  @Patch('/')
  patchTest(req: Request, res: Response): void {
    res.json({path: req.path, method: req.method.toLowerCase()});
  }

  @Delete('/')
  deleteTest(req: Request, res: Response): void {
    res.json({path: req.path, method: req.method.toLowerCase()});
  }

  @Put('/put-update')
  @Patch('/patch-update')
  putPatchUpdate(req: Request, res: Response): void {
    res.json({path: req.path, method: req.method.toLowerCase()});
  }
}

export default function givenTestController(): TestController {
  return new TestController();
}
