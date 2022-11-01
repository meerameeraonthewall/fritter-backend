import type {Types} from 'mongoose';
import CitationModel from './model';
import type {Citation} from './model';

/**
 * Operations:
 *  addOne
 *  removeOne
 *  findOne
 */

class CitationCollection {
  /**
   * Add a citation to the collection
   *
   * @param {string} freetId - The id of the freet
   * @param {string} url - The url to cite
   * @return {Promise<Citation>} - The newly created citation
   */
  static async addOne(freetId: Types.ObjectId | string, url: string): Promise<Citation> {
    const newCitation = new CitationModel({freetId, url});
    await newCitation.save(); // Saves citation to MongoDB
    return newCitation;
  }

  /**
   * Remove a citation with given value.
   *
   * @param {string} citationId - The Id of citation to remove
   * @return {Promise<Boolean>} - true if the citation has been deleted, false otherwise
   */
  static async removeOne(citationId: Types.ObjectId | string): Promise<boolean> {
    const citation = await CitationModel.deleteOne({_id: citationId});
    return citation !== null;
  }

  /**
   * Find a citation by citationId
   *
   * @param {string} citationId - The id of the citation to find
   * @return {Promise<Citation> | Promise<null> } - The citation with the given citationId, if any
   */
  static async findOne(citationId: Types.ObjectId | string): Promise<Citation> {
    return CitationModel.findOne({_id: citationId});
  }

  /**
   * Find all citation by freetId
   */
  static async findByFreetId(freetId: Types.ObjectId | string): Promise<Citation[]> {
    const citations = await CitationModel.find({freetId});
    return citations;
  }
}

export default CitationCollection;
