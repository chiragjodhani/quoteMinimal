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

export default async function listQuotes(req, res) {
  try {
    // Read the quotes from the JSON file
    const data = await fs.promises.readFile(quotesFilePath, 'utf8');
    const quotes = JSON.parse(data);

    const quotesArray = quotes['results']
    // Select a random quote
    //const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const page = parseInt(req.query.page, 10) || 1;
   const limit = parseInt(req.query.limit, 10) || 10;
  
    // Calculate start and end indexes
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    // Paginated items
    const paginatedItems = quotesArray.slice(startIndex, endIndex);
  
    // Total pages
    const totalPages = Math.ceil(quotesArray.length / limit);
  
    res.json({
      page,
      limit,
      totalItems: quotesArray.length,
      totalPages,
      items: paginatedItems,
    });
    // Return the quote as a JSON response
    //res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch a quote.' });
  }
}
