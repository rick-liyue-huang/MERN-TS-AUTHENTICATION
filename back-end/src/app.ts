// Copyright 2023 rickhuang668
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { isHttpError } from 'http-errors';
import { blogRouter } from './routes/blogs';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api/blogs', blogRouter);

/*
app.use('/foo', (req: Request, res: Response, next: NextFunction) => {
  // next(new Error(`wrong path of ${req}`));
  console.log(req.url);

  next(createHttpError(404, `wrong path of ${req.url}`));
});
*/

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error('error: ', error);
  let errMessage = 'Unknown error';
  let statusCode = 500;
  // if (error instanceof Error) {
  //   errMessage = error.message;
  // }

  // receive error from http-errors as created in controllers/blogs.ts
  if (isHttpError(error)) {
    errMessage = error.message;
    statusCode = error.status;
  }
  res.status(statusCode).json({ errMessage: errMessage });
});
