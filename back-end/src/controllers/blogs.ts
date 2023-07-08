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

import { NextFunction, Request, RequestHandler, Response } from "express";
import { BlogModel } from "../models/blog";

export const getAllBlogsController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // throw new Error('test');
    const blogs = await BlogModel.find().exec();
    res.status(200).json(blogs);
  } catch (err) {
    next(err);
  }
};

export const getBlogByIdController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const blogId = req.params.blogId;
  console.log(blogId);

  try {
    const singleBlog = await BlogModel.findById(blogId).exec();
    res.status(200).json(singleBlog);
  } catch (err) {
    next(err);
  }
};

export const createBlogController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const title = req.body.title;
  const text = req.body.text;

  try {
    const newBlog = await BlogModel.create({ title, text });
    res.status(201).json(newBlog);
  } catch (err) {
    next(err);
  }
};
