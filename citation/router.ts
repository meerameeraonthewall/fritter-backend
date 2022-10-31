import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as citationValidator from '../citation/middleware';
import * as util from '../freet/util';
import CitationModel from './model';
import CitationCollection from './collection';
import type {Freet} from '../freet/model';

const router = express.Router();

/**
 * Add a citation to a freet
 *
 * @name PUT /api/freets/cite/:id
 *
 * @param {string} freetId - the id to add a citation to
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the URLS are not correctly formatted URLs separated by commas
 */
router.put(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    citationValidator.isValidCitation
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.findOne(req.params.freetId);
    const urls: string = req.body.urls.replace(/\s+/g, '');
    const urlArr = urls.split(',');

    await Promise.all(urlArr.map(async (url): Promise<boolean> => {
      await CitationCollection.addOne(freet._id, url);
      return true;
    }));

    const updatedFreet = await FreetCollection.findOne(req.params.freetId);
    res.status(200).json({
      message: 'Your successfully added citations.',
      freet: util.constructFreetResponse(updatedFreet)
    });
  }
);

export {router as citationRouter};
