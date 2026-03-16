const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  const cookies = req.headers.cookie || '';
  const isAuthed = cookies.includes('auth=true');

  if (isAuthed) {
    try {
      // Try multiple possible paths
      const possiblePaths = [
        path.join(process.cwd(), 'home.html'),
        path.join(__dirname, '../home.html'),
        path.join(__dirname, '../../home.html'),
      ];

      let html = null;
      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          html = fs.readFileSync(filePath, 'utf8');
          break;
        }
      }

      if (html) {
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);
      } else {
        return res.status(500).send('home.html not found. Paths tried: ' + possiblePaths.join(', '));
      }
    } catch (e) {
      return res.status(500).send('Error: ' + e.message);
    }
  }

  res.setHeader('Location', '/');
  return res.status(302).end();
};
