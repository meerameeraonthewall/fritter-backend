import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {FreetReact} from '../freetreact/model';
import UserCollection from '../user/collection';

type FreetReactResponse = {
  _id: string;
  reactor: string;
  freetId: string;
  value: number;
};

/**
 * Transform a raw FreetReact object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<FreetReact>} freetReact - A freetreact
 * @returns {FreetReactResponse} - The freet object formatted for the frontend
 */
// TODO: figure out how to represent freetreacts to frontend