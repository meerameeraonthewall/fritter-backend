import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from '../freet/model';
import FreetModel from '../freet/model';
import FreetReactModel from '../freetreact/model';
import type {FreetReact} from '../freetreact/model';
import UserCollection from '../user/collection';
import FreetReactCollection from '../freetreact/collection';
import FreetCollection from '../freet/collection';
import type {Citation} from './model';
import CitationModel from './model';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 */
class CitationCollection {
  /**
   * Add a citation to the freet
   *
   * @param {string} freetId - The id of the freet
   * @param {string} content - One URL to cite
   * @return {Promise<Freet>} - The same freet, now with the citation added
   */
  static async addOne(freetId: Types.ObjectId | string, content: string): Promise<Freet> {
    const freet = await FreetModel.findOne({_id: freetId});
    const citation = new CitationModel(freetId, content);
    freet.citations.push(citation);
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('citations');
  }

  /**
   * Find a citation by citationId
   *
   * @param {string} citationId - The id of the citation to find
   * @return {Promise<Citation> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(citationId: Types.ObjectId | string): Promise<Citation> {
    return CitationModel.findOne({_id: citationId}).populate('content');
  }

  /**
   * Remove/delete a citation with given citationId.
   *
   * @param {string} citationId - The id of citation to delete
   * @return {Promise<Boolean>} - true if the citation has been deleted, false otherwise
   */
  static async deleteOne(citationId: Types.ObjectId | string): Promise<boolean> {
    const citation = await FreetModel.deleteOne({_id: citationId});
    return citation !== null;
  }
}

export default CitationCollection;
