import type {HydratedDocument, Types} from 'mongoose';
import moment from 'moment';
import type {FreetReact, PopulatedFreetReact} from './model';
import UserCollection from '../user/collection';

export type FreetReactResponse = {
  _id: string;
  reactor: string;
  value: number;
};

/**
 * Transform a raw FreetReact object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<FreetReact>} react - A freetreact
 * @returns {FreetReactResponse} - The freet object formatted for the frontend
 */
const constructFreetReactResponse = (react: HydratedDocument<FreetReact>): FreetReactResponse => {
  const reactCopy: PopulatedFreetReact = {
    ...react.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = reactCopy.reactorId;
  delete reactCopy.reactorId;
  return {
    ...reactCopy,
    _id: reactCopy._id.toString(),
    reactor: username,
    value: Number(reactCopy.value)
  };
};

export {
  constructFreetReactResponse
};
