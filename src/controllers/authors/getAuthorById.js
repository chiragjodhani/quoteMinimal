import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authorFilePath = path.join(__dirname, 'author.json');

fs.promises.access(authorFilePath)
  .catch(() => fs.promises.writeFile(authorFilePath, '[]'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

/**
 * Get a single author by ID
 */
export default async function getAuthorById(req, res, next) {
  try {
    // Read the quotes from the JSON file
    const data = await fs.promises.readFile(authorFilePath, 'utf8');
    const author = JSON.parse(data);

    const authorArray = author['results']
    const { id } = req.params
    const result = await authorArray.filter(function(e, i) {
  return e['_id'] == id
})
    // console.log('result:', result);
    if (!result) {
      return next(createError(404, 'The requested resource could not be found'))
    }
    res.status(200).json(result)
  } catch (error) {
    return next(error)
  }
}
