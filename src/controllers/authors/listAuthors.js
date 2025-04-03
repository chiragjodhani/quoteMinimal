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


export default async function listAuthors(req, res, next) {
  try {
    // Read the quotes from the JSON file
    const data = await fs.promises.readFile(authorFilePath, 'utf8');
    const author = JSON.parse(data);

    const authorArray = author['results']
    // Select a random quote
    //const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const page = parseInt(req.query.page, 10) || 1;
   const limit = parseInt(req.query.limit, 10) || 10;
  
    // Calculate start and end indexes
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    // Paginated items
    const paginatedItems = authorArray.slice(startIndex, endIndex);
  
    // Total pages
    const totalPages = Math.ceil(authorArray.length / limit);
  
    res.json({
      page,
      limit,
      totalItems: authorArray.length,
      totalPages,
      items: paginatedItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch a quote.' });
  }
}
