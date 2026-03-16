import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  const cookies = req.headers.cookie || '';
  const isAuthed = cookies.includes('auth=true');

  if (isAuthed) {
    // Serve the actual page
    try {
      const filePath = join(process.cwd(), 'public', 'home.html');
      const html = readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (e) {
      return res.status(500).send('Could not load page.');
    }
  }

  // Not authenticated — redirect to login
  res.setHeader('Location', '/');
  return res.status(302).end();
}
