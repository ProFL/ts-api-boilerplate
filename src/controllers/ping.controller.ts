import {Get, JsonController} from 'routing-controllers';

@JsonController('/ping')
export default class PingController {
  @Get('/')
  index(): {message: string} {
    return {message: 'pong'};
  }
}
