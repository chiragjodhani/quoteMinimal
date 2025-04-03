import { lowerCase, toLower, clamp, compact, isEmpty } from 'lodash-es'
import getTagsFilter from '../utils/getTagsFilter.js'
import getLengthFilter from '../utils/getLengthFilter.js'
import { MAX_RANDOM_COUNT } from '../../constants.js'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const quotesFilePath = path.join(__dirname, 'quotes.json');

/**
 * Returns an object containing the `query` parameter (if any) and a flag that
 * indicates if the query is an advanced query.
 *
 * An advanced query includes
 * - Logical operators (AND | OR | NOT)
 * - Prefixed search terms `<field>:<search term>`
 *
 * @param {string} rawQuery the `query` parameter
 * @return {{query: string, isAdvancedQuery: boolean}}
 */

fs.promises.access(quotesFilePath)
  .catch(() => fs.promises.writeFile(quotesFilePath, '[]'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
export function parseQuery(rawQuery, defaultFields) {
  // Exact phrase...
  // If the query is wrapped in quotes, we search for an exact phrase.
  // https://www.mongodb.com/docs/atlas/atlas-search/phrase/
  if (/^(".+")|('.+')$/.test(rawQuery)) {
    return { query: lowerCase(rawQuery), exactPhrase: true }
  }

  // Otherwise, we will use the `queryString` operator...
  // @see https://www.mongodb.com/docs/atlas/atlas-search/queryString/

  // 1. Remove special characters except for parenthesis and colon
  let query = rawQuery.replace(/[^a-z:\s()[\]]/gi, '').trim()
  let error

  // 2. Check for logical operators and prefixed search terms
  const operators = query.match(/(AND)|(OR)|(NOT)/g) || []
  const prefixedTerms = query.match(/(author)|(content)|(tags):/gi) || []

  // 2. Check for invalid prefixes
  const supportedFields = ['content', 'author', 'tags']
  if (prefixedTerms.some(term => !supportedFields.includes(toLower(term)))) {
    error = `Query contains an invalid field prefix. Supported fields are ${supportedFields.join(
      ' | '
    )}`
  }

  // 3. Limit the number of operators and prefixes that can be included
  if (operators.length > 5 || prefixedTerms.length > 3 || query.length > 150) {
    error = 'Query exceeded maximum length. See documentation for limits'
  }

  // Search both content and tags
  if (query.includes('content:')) {
    const keywords = /content:((\w+)|(\([\w ]+\)))/i
    query = query.replace(keywords, (_, m) => `(content:${m} OR tags:${m} )`)
  }

  return { query, error }
}

export async function getRandomQuotes(params, next) {
  try {
      const data = await fs.promises.readFile(quotesFilePath, 'utf8');
      const quotes = JSON.parse(data);
      const quotesArray = quotes['results'];
      const results = await getRandomElements(quotesArray, 1)
    return results
  } catch (error) {
      console.log('error:', error);
    return next(error)
  }
}

function getRandomElements(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

export default async function randomQuotes(req, res, next) {
  const results = await getRandomQuotes(req.query, next)
  res.status(200).json(results)
}
