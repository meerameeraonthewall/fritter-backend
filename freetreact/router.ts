import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from '../freet/util';
import type {Types} from 'mongoose';

const router = express.Router();

/**
 * React to a freet
 *
 * @name PUT /api/freetreacts/:id
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
    const {freetId} = req.params;
    const userId = (req.session.userId as string) ?? '';
    // Find the reactId of any existing freetreact by this user
    const oldReact = await FreetCollection.findFreetReactByFreetAndReactor(freetId, userId);
    const newReactValue = Number(req.body.reactValue);

    if (oldReact === null || oldReact === undefined) {
      console.log('No react found on this freet from this user');
    } else {
      const oldReactId: Types.ObjectId = oldReact._id;
      // If this freet has already been reacted to by this user...
      const oldReactValue = oldReact.value;

      // Remove the react
      const reactRemoved = await FreetCollection.removeFreetReact(oldReactId);
      if (!reactRemoved) {
        console.log('For some reason the react could not be removed');
      }

      if (oldReactValue === newReactValue) {
        const freet = await FreetCollection.findOne(freetId);
        // Leave react removed if the new react value is the same as the previous.
        res.status(200).json({
          message: 'You successfully removed your react to the freet.',
          freet: util.constructFreetResponse(freet)
        });
        return;
      }
    }

    await FreetCollection.addFreetReact(freetId, newReactValue, userId);
    const freet = await FreetCollection.findOne(freetId);
    res.status(200).json({
      message: 'You successfully reacted to the freet.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

export {router as freetReactRouter};
