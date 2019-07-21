import { Request, Response } from 'express';
import { Get } from '../decorators/controller';
import ControllerBase from './controller-base';

export default class PingController extends ControllerBase {
  constructor() {
    super('/ping');
  }

  @Get('/')
  index(_: Request, res: Response): void {
    res.json({ message: 'pong' });
  }
}
