import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

// Type definition for Citation on the backend
export type Citation = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  freetId: Types.ObjectId;
  content: string;
};

const CitationSchema = new Schema<Citation>({
  // The Freet freetId
  freetId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  // The url for the citation
  content: {
    type: String,
    required: true
  }
});

const CitationModel = model<Citation>('Citation', CitationSchema);
export default CitationModel;
