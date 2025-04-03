import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const taskFolder = './quotes/';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authorFilePath = path.join(__dirname, 'author.json');

fs.promises.access(authorFilePath)
  .catch(() => fs.promises.writeFile(authorFilePath, '[]'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const quotesFilePath = path.join(__dirname, "..", "quotes", 'quotes.json');
fs.promises.access(quotesFilePath)
  .catch(() => fs.promises.writeFile(quotesFilePath, '[]'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
/**
 * Get a single author by slug
 */
export default async function getAuthorById(req, res, next) {
  try {
    const { slug } = req.params

    if (!slug) {
      return next(createError(422, 'Slug is required'))
    }
    // // Get the author
    // const author = await Authors.findOne({ slug: `${slug}` }).select(
    //   '-__v -aka'
    // )

    // if (!author) {
    //   return next(createError(404, 'The requested resource could not be found'))
    // }
    // // Get quotes by this author
    // const quotes = await Quotes.find({ authorId: author._id }).select(
    //   '-__v -authorId'
    // )
    const dataQuote = await fs.promises.readFile(quotesFilePath, 'utf8');
    const quotes = JSON.parse(dataQuote);

    const data = await fs.promises.readFile(authorFilePath, 'utf8');
    const author = JSON.parse(data);

    const authorArray = author['results']
    const authorList = await authorArray.filter(function(e, i) {
  return e['slug'] == slug
})

const quotesArray = quotes['results']
const quotesList = await quotesArray.filter(function(e, i) {
return e['authorSlug'] == slug
})
    res.status(200).json({authorList, quotesList })
  } catch (error) {
    return next(error)
  }
}
