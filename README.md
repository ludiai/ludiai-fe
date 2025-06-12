# what is this

this contains ludi ai's landing page and the prototype

# how to run

`npm ci`

`npm start`

# OpenAI API Integration

To use the search query analyzer feature, you'll need to:

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Create a `.env` file in the project root with:
   ```
   REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
   ```
3. Restart the development server

Then you can access the query analyzer at `/query-analyzer` route.
