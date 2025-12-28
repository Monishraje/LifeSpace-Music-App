
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const testSongUpload = async () => {
    try {
        const form = new FormData();
        form.append('title', 'Test Song');
        form.append('song', fs.createReadStream(__dirname + '/../frontend/placeholder.txt'));

        const res = await axios.post('http://localhost:5000/api/songs/upload', form, {
            headers: {
                ...form.getHeaders(),
                'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY3NDIyYjI5YjJjOTI0NzMzYjA5ZGU3In0sImlhdCI6MTcxODg4NjU3OCwiZXhwIjoxNzE4OTIyNTc4fQ.5V4q3ga2A3qJWw_s3v4a_NTwM-J3p_zIN2E-a3a-z4E'
            }
        });

        console.log(res.data);
    } catch (err) {
        console.error(err);
    }
};

testSongUpload();
