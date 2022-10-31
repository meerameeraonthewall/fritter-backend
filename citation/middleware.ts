import type {Request, Response, NextFunction} from 'express';
import FreetReactCollection from 'freetreact/collection';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';

/**
 * Checks if citation content is valid
 */
const isValidCitation = async (req: Request, res: Response, next: NextFunction) => {
  const {url} = req.body as {url: string};
  // Expression from https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
  const expression = '(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)(,\s?)?)';
  const regex = new RegExp(expression);

  if (!regex.exec(url)) {
    res.status(400).json({
      error: 'Citation must have valid URLs, separated by commas.'
    });
    return;
  }

  next();
};

export {isValidCitation};
