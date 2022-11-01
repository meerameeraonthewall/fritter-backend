import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import CitationCollection from './collection';

/**
 * Checks if a citation with citationId in req.params exists
 */
const isCitationExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.citationId);
  const citation = validFormat ? await CitationCollection.findOne(req.params.citationId) : '';
  if (!citation) {
    res.status(404).json({
      error: {
        citationNotFound: `Citation with ID ${req.params.citationId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the url in req.body is valid, with http protocol
 */
const isValidUrl = (req: Request, res: Response, next: NextFunction) => {
  const {url} = req.body as {url: string};
  console.log('checking URL');
  // Syntax from https://www.regextester.com/93652
  const exp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  const urlPattern = new RegExp(exp);

  if (!urlPattern.test(url)) {
    res.status(400).json({
      error: 'URL must be valid URL.'
    });
    return;
  }

  next();
};

export {
  isCitationExists,
  isValidUrl
};
