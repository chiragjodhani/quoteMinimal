import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import getSortParams from '../utils/getSortParams.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tagFilePath = path.join(__dirname, 'tags.json');

fs.promises.access(tagFilePath)
  .catch(() => fs.promises.writeFile(tagFilePath, '[]'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

export default async function listTags(req, res, next) {
  try {
    const tagArraydata = await fs.promises.readFile(tagFilePath, 'utf8');
    var parse = Object.values(JSON.parse(tagArraydata));
    const tagArray = parse.sortBy('name');
    res.json({tags:tagArray});
  } catch (error) {
    return next(error)
  }
}


Array.prototype.sortBy = function(p) {
  return this.slice(0).sort(function(a,b) {
    return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
  });
}
