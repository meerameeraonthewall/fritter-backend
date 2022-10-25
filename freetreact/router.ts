import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetReactCollection from './collection';
import FreetCollection from '../freet/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * React to a freet
 *
 * @name PUT /api/freetreact/:id
 *
 * @param {number} value - the value of the reaction
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the freetId is not valid
 */
router.put(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
    // TODO: freetValidator.isFreetReactor for the freet
    
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

export {router as freetRouter};
