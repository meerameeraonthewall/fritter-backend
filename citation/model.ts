import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';

// Type definition for Citation on the backend
export type Citation = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Types.ObjectId;
  url: string;
};

const CitationSchema = new Schema<Citation>({
  // The Freet freetId
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // The url associated with the citation
  url: {
    type: String,
    required: true
  }
});

const CitationModel = model<Citation>('Citation', CitationSchema);
export default CitationModel;
