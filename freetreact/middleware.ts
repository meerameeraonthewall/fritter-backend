import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetReactCollection from '../freetreact/collection';

/**
 * Checks if a freetReact with reactId is req.params exists
 */
const isFreetReactExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.reactId);
  const freetReact = validFormat ? await FreetReactCollection.findOne(req.params.reactId) : '';
  if (!freetReact) {
    res.status(404).json({
      error: {
        freetReactNotFound: `FreetReact with react ID ${req.params.reactId} does not exist.`
      }
    });
    return;
  }

  next();
};

export {
  isFreetReactExists
};
