import type {Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as citationValidator from './middleware';
import CitationCollection from './collection';

const router = express.Router();

/**
 * Add Citation
 *
 * @name POST /api/cite/:id
 *
 * @param {string} url - the URL to cite
 * @return {Citation}  the new citation
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the url is not valid i.e. no http protocol or standard url shape
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    citationValidator.isValidUrl
  ],
  async (req: Request, res: Response) => {
    const {freetId} = req.params;
    const {url} = req.body;
    const citation = await CitationCollection.addOne(freetId, url);
    res.status(201).json({
      message: 'Your citation was created successfully.',
      citation
    });
  }
);

/** Get all citations for a freet
 *
 * @name GET /api/cite/:id
 *
 * @return {Citation[]} an array of citations
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 */

/**
 * Remove a citation
 *
 * @name DELETE /api/cite/:id
 *
 * @return {string} - a success message
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the citation with the ID doesn't exist
 */
router.delete(
  '/:citationId?',
  [
    userValidator.isUserLoggedIn,
    citationValidator.isCitationExists
  ],
  async (req: Request, res: Response) => {
    console.log('begin delete cite');
    const {citationId} = req.params;
    console.log('HERE');
    await CitationCollection.removeOne(citationId);
    res.status(200).json({
      message: 'Your citation was deleted successfully.'
    });
  }
);

export {router as citationRouter};
