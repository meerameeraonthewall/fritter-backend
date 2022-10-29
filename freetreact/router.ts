import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetReactCollection from './collection';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from '../freet/util';
import {Types} from 'mongoose';
import type Freet from '../freet/model';

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
  '/:freetId',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    console.log('begin freet react');
    const {freetId} = req.params;
    const freet = await FreetCollection.findOne(freetId);
    const userId = (req.session.userId as string) ?? '';
    // Find the reactId of any existing freetreact by this user
    const oldReact = await FreetCollection.findFreetReactByFreetAndReactor(freet._id, userId);
    const newReactValue = Number(req.body.reactValue);
    console.log('old react: ', oldReact);
    console.log('request body: ', req.body);
    console.log('New React value: ', newReactValue);

    if (oldReact === null || oldReact === undefined) {
      console.log('No react found on this freet from this user');
    } else {
      console.log('else statement');
      const oldReactId: Types.ObjectId = oldReact._id;
      // If this freet has already been reacted to by this user...
      const oldReactValue = oldReact.value;

      // Remove the react
      const reactRemoved = await FreetCollection.removeFreetReact(freet._id, oldReactId);
      if (!reactRemoved) {
        console.log('For some reason the react could not be removed');
      }

      if (oldReactValue === newReactValue) {
        const updatedFreet = await FreetCollection.findOne(freetId);
        // Leave react removed if the new react value is the same as the previous.
        res.status(200).json({
          message: 'You successfully removed your react to the freet.',
          freet: util.constructFreetResponse(updatedFreet)
        });
        return;
      }
    }

    await FreetCollection.addFreetReact(freet._id, newReactValue, userId);
    res.status(200).json({
      message: 'You successfully reacted to the freet.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

export {router as freetReactRouter};
