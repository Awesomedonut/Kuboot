// server.js
const express = require('express');
const prisma = require('./prisma'); // Import the Prisma Client
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Endpoint to create a new story
app.post('/api/stories', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  try {
    const story = await prisma.story.create({
      data: { title, content },
    });
    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Failed to create story.' });
  }
});

// Endpoint to fetch all stories
app.get('/api/stories', async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories.' });
  }
});

// Serve the create story page
app.get('/create-story', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'create-story.html'));
});

app.get('/', (req, res) => { 
    res.send('Home');
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
