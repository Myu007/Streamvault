const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  const cookies = req.headers.cookie || '';
  const isAuthed = cookies.includes('auth=true');

  if (isAuthed) {
    try {
      const filePath = path.join(process.cwd(), 'public', 'home.html');
      const html = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (e) {
      return res.status(500).send('Could not load page.');
    }
  }

  res.setHeader('Location', '/');
  return res.status(302).end();
};
