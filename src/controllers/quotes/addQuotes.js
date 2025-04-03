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

export default async function addQuotes(req, res) {
    try {
        // Read the quotes from the JSON file
        const data = await fs.readFileSync(quotesFilePath, 'utf8');
        const quotes = JSON.parse(data);
        const { _id, content, author, tags, authorSlug, length, dateAdded, dateModified } = req.body;
        const quotesArray = quotes['results']
        const newQuote = { _id, content, author, tags, authorSlug, length, dateAdded, dateModified };
        quotesArray.push(newQuote);
        var newData = JSON.stringify(quotes);
        // Write the updated quotes array back to the JSON file
//        await fs.writeFile(quotesFilePath, JSON.stringify(newData));
        
        fs.writeFile(quotesFilePath, newData, err => {
            // error checking
            if(err) throw err;
            console.log("New data added");
        });
        // Return the new quote as a JSON response
        res.json(newQuote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Unable to fetch a quote.' });
    }
}
