import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const quotesFilePath = path.join(__dirname, 'quotes.json');


fs.promises.access(quotesFilePath)
  .catch(() => fs.promises.writeFile(quotesFilePath, '[]'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
export default async function getQuoteById(req, res, next) {
  try {

    const data = await fs.promises.readFile(quotesFilePath, 'utf8');
    const quotes = JSON.parse(data);

    const quotesArray = quotes['results']
    const { id } = req.params
    const result = await quotesArray.filter(function(e, i) {
  return e['_id'] == id
})//Quotes.findById(id).select('-__v -authorId')

    if (!result) {
      return next(createError(404, 'The requested resource could not be found'))
    }

    res.status(200).json(result)
  } catch (error) {
    return next(error)
  }
}
