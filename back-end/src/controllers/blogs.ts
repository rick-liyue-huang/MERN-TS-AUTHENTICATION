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

import { RequestHandler } from 'express';
import mongoose from 'mongoose';
import { BlogModel } from '../models/blog';
import createHttpError from 'http-errors';

interface CreateBlogBody {
  title?: string;
  text?: string;
}

interface UpdateBlogBody {
  title?: string;
  text?: string;
}

interface UpdateBlogParams {
  blogId: string;
}

export const getAllBlogsController: RequestHandler = async (req, res, next) => {
  try {
    // throw new Error('test');
    const blogs = await BlogModel.find().exec();
    res.status(200).json(blogs);
  } catch (err) {
    next(err);
  }
};

export const getBlogByIdController: RequestHandler = async (req, res, next) => {
  try {
    const blogIdString = req.params.blogId;

    // const blogId = new mongoose.Types.ObjectId(blogIdString);
    console.log(typeof blogIdString);

    // careful: mongoose.isValidObjectId() is used to check if the string is a valid ObjectId
    if (!mongoose.isValidObjectId(blogIdString)) {
      throw createHttpError(400, 'Invalid blog id!!!');
    }

    const singleBlog = await BlogModel.findById(blogIdString).exec();

    // console.log('----------- singleBlog ---------- : ', singleBlog);

    // after using mongoose.isValidObjectId(), the following check is for the case that the blogId is not found
    if (!singleBlog) {
      throw createHttpError(404, 'Blog not found!!!');
    }
    res.status(200).json(singleBlog);
  } catch (err) {
    next(err);
  }
};

export const createBlogController: RequestHandler<
  unknown,
  unknown,
  CreateBlogBody,
  unknown
> = async (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;

  try {
    if (!title) {
      // send the error to the error handler
      throw createHttpError(400, 'Missing title!!!');
    }

    const newBlog = await BlogModel.create({ title, text });
    res.status(201).json(newBlog);
  } catch (err) {
    next(err);
  }
};

export const updateBlogController: RequestHandler<
  UpdateBlogParams,
  unknown,
  UpdateBlogBody,
  unknown
> = async (req, res, next) => {
  try {
    const blogIdString = req.params.blogId;
    const blogTitle = req.body.title;
    const blogText = req.body.text;

    if (!mongoose.isValidObjectId(blogIdString)) {
      throw createHttpError(400, 'Invalid blog id!!!');
    }

    if (!blogTitle) {
      throw createHttpError(400, 'Missing title!!!');
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      blogIdString,
      { title: blogTitle, text: blogText },
      { new: true }
    ).exec();

    if (!updatedBlog) {
      throw createHttpError(404, 'Blog not found!!!');
    }

    res.status(200).json(updatedBlog);
  } catch (err) {
    next(err);
  }
};

export const deleteBlogController: RequestHandler = async (req, res, next) => {
  try {
    const blogIdString = req.params.blogId;

    if (!mongoose.isValidObjectId(blogIdString)) {
      throw createHttpError(400, 'Invalid blog id!!!');
    }

    const deletedBlog = await BlogModel.findByIdAndDelete(blogIdString).exec();
    if (!deletedBlog) {
      throw createHttpError(404, 'Blog not found!!!');
    }
    res.status(200).json({ message: 'Blog deleted successfully!!!' });
  } catch (err) {
    next(err);
  }
};
