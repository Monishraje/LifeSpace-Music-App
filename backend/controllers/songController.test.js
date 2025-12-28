const request = require('supertest');
const express = require('express');
const songController = require('./songController');
const auth = require('../middleware/auth');
const app = express();
app.use(express.json());
app.post('/upload', auth, songController.upload);
describe('Song Controller', () => {
  it('should upload a song', async () => {
    const res = await request(app)
      .post('/upload')
      .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY3NDIyYjI5YjJjOTI0NzMzYjA5ZGU3In0sImlhdCI6MTcxODg4NjU3OCwiZXhwIjoxNzE4OTIyNTc4fQ.5V4q3ga2A3qJWw_s3v4a_NTwM-J3p_zIN2E-a3a-z4E')
      .field('title', 'Test Song')
      .attach('song', 'frontend/placeholder.txt');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', 'Test Song');
  });
});