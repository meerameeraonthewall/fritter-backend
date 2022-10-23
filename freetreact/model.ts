import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

// Type definition for FreetReact on the backend
export type FreetReact = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Types.ObjectId;
  reactorId: Types.ObjectId;
  value: number;

};

const FreetReactSchema = new Schema<FreetReact>({
  // The Freet freetId
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // The userId of the user reacting
  reactorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The numerical value of the reaction
  value: {
    type: Number,
    required: true
  }
});

const FreetReactModel = model<FreetReact>('FreetReact', FreetReactSchema);
export default FreetReactModel;
