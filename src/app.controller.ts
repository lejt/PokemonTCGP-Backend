import { Controller, All, Response } from '@nestjs/common';
import { Response as Res } from 'express';

@Controller()
export class AppController {
  @All('*') // Catch all HTTP methods including OPTIONS
  handleOptions(@Response() res: Res) {
    // Send a 200 OK status for OPTIONS requests to allow preflight
    res.status(200).send();
  }
}
