import type {HydratedDocument, Types} from 'mongoose';
import type {FreetReact} from './model';
import FreetReactModel from './model';
import type {Freet} from '../freet/model';
import FreetModel from '../freet/model';
import UserCollection from '../user/collection';

/**
 * Operations:
 *  addOne
 *  removeOne
 *  findOne
 */

class FreetReactCollection {
  /**
   * Add a freetreact to the collection
   *
   * @param {string} reactorId - The id of the user reacting to the freet
   * @param {string} freetId - The id of the freet
   * @param {string} value - The value of the react
   * @return {Promise<HydratedDocument<Freet>>} - The freet, now reacted-to
   */
  static async addOne(reactorId: Types.ObjectId | string, freetId: Types.ObjectId | string, value: number): Promise<HydratedDocument<Freet>> {
    const freet = (await FreetModel.findOne({_id: freetId}));
    const newReact = new FreetReactModel({freetId, reactorId, value});
    freet.reacts.push(newReact);
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('reacts');
  }

  /**
   * Remove a freetReact with given value.
   *
   * @param {string} reacttId - The Id of react to remove
   * @return {Promise<Boolean>} - true if the react has been deleted, false otherwise
   */
  static async removeOne(reactId: Types.ObjectId | string): Promise<boolean> {
    const freetReact = await FreetReactModel.deleteOne({_id: reactId});
    return freetReact !== null;
  }

  /**
   * Find a freetreact by reactId
   *
   * @param {string} reactId - The id of the react to find
   * @return {Promise<FreetReact> | Promise<null> } - The freetreact with the given reactId, if any
   */
  static async findOne(reactId: Types.ObjectId | string): Promise<FreetReact> {
    return FreetReactModel.findOne({_id: reactId}).populate('freetId');
  }
}

export default FreetReactCollection;
