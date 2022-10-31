import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import FreetReactModel from '../freetreact/model';
import type {FreetReact} from '../freetreact/model';
import UserCollection from '../user/collection';
import FreetReactCollection from '../freetreact/collection';
import {isValidFreetContent} from './middleware';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date
    });
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('authorId');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId}).populate('authorId');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.content = content;
    freet.dateModified = new Date();
    await freet.save();
    return freet.populate('authorId');
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.deleteOne({_id: freetId});
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({authorId});
  }

  /**
   *  Add a freetreact to the freet
   * @param {string} freetId - The ID of the freet being reacted to
   * @param {number} value - The value of the react
   * @param {string} reactorId - The ID of the user reacting
   * @return {Promise<FreetReact>} - The same freet, now with a new react
   */
  static async addFreetReact(freetId: Types.ObjectId | string, value: number, reactorId: Types.ObjectId | string): Promise<FreetReact> {
    const freet = await FreetModel.findOne({_id: freetId});
    const react = new FreetReactModel({
      freetId,
      reactorId,
      value
    });

    await react.save();
    freet.reacts.push(react);
    await freet.save();
    return react;
  }

  /**
   *  Remove a freetreact from the freet
   * @param {string} freetId - The freetId of the freet from which to remove a react
   * @param {string} reactId - The Id of the react to remove from the freet
   * @return {Promise<boolean>} - true if the react has been deleted, false otherwise
   */
  static async removeFreetReact(freetId: Types.ObjectId | string, reactId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.findOne({_id: freetId});
    let reactIndex = 0;
    for (let i = 0; i < freet.reacts.length; i++) {
      const react = freet.reacts[i];
      if (react._id === reactId) {
        reactIndex = i;
        break;
      }
    }

    if (reactIndex > -1) {
      freet.reacts.splice(reactIndex, 1);
      await freet.save();
      await FreetReactModel.deleteOne({_id: reactId});
      return true;
    }

    return false;
  }

  /**
   * Check if freet has already been reacted to by the user
   *
   * @param {string} freetId - The freetId of the freet to check
   * @param {string} reactorId - The userId of the reactor to check
   * @return {Promise<FreetReact| undefined>} - the reactId if the reactorId is in the freet's reacts, false otherwise
   */
  static async findFreetReactByFreetAndReactor(freetId: Types.ObjectId | string, reactorId: Types.ObjectId | string): Promise<FreetReact | undefined> {
    const freet = await FreetModel.findOne({_id: freetId}).populate('reacts');
    console.log('HERE');
    console.log(freet.reacts);
    console.log(reactorId);
    for (const react of freet.reacts) {
      console.log(react.reactorId, react.reactorId.toString());
      if (react.reactorId.toString() === reactorId.toString()) {
        return react;
      }
    }

    return null;
  }
}

export default FreetCollection;
