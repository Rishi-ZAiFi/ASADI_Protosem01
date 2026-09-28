# Content Repurposer

## Description
Content Repurposer is a full-stack AI-powered web application that takes a single piece of content and automatically adapts it for specific social media platforms (LinkedIn, Instagram, X/Twitter, and YouTube). It leverages the Gemini API to intelligently reshape the tone, format, and structure while preserving your original message.

## Features
- **Multi-Platform Support**: Generate optimized content for LinkedIn, Instagram, X, and YouTube simultaneously.
- **Customizable Tones**: Choose from Professional, Casual, Educational, Storytelling, or Engaging tones.
- **Editable Results**: Review and edit the generated content before publishing.
- **One-Click Copy**: Easily copy the generated content to your clipboard.
- **Modern UI**: Clean, responsive, SaaS-style dashboard.

## Tech Stack
- **Frontend**: React + Vite, Vanilla CSS
- **Backend**: Python + Flask, Flask-CORS
- **AI**: Google Gemini API (`google-generativeai`)

## Project Structure
```text
Content-Repurposer/
├── frontend/             # React application (Vite)
│   ├── src/              # React components and CSS
│   ├── package.json      # Frontend dependencies
│   └── ...
├── backend/              # Flask Python API
│   ├── app.py            # Main backend application
│   ├── requirements.txt  # Python dependencies
│   ├── .env.example      # Example environment variables
│   └── .env              # Actual environment variables (Git ignored)
├── .gitignore            # Ignored files and folders
└── README.md             # Project documentation
```

## Setup Instructions

### 1. Environment Variables Setup (Backend)
Navigate to the `backend/` directory and configure your Gemini API Key.
1. Create a `.env` file inside the `backend` folder (if it doesn't exist already).
2. Open `backend/.env` and add your Google Gemini API Key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
*(Note: Never commit your actual `.env` file to version control. An `.env.example` is provided for reference.)*

### 2. How to run Backend (Flask)
Open a terminal and run the following commands:
```powershell
cd backend
python -m venv venv
# Activate the virtual environment (Windows):
venv\Scripts\activate
# Install requirements:
pip install -r requirements.txt
# Run the application:
python app.py
```
*The backend API will run on `http://localhost:5000`.*

### 3. How to run Frontend (React)
Open a new terminal and run:
```powershell
cd frontend
npm install
npm run dev
```
*The frontend application will run on `http://localhost:5173`.*

## API Endpoint Documentation
### `POST /generate`
Generates platform-specific content based on input content, selected platforms, and tone.

**Request Body:**
```json
{
  "content": "We just launched our new AI tool that helps developers write code 10x faster...",
  "platforms": ["linkedin", "instagram", "x", "youtube"],
  "tone": "professional"
}
```

**Success Response (200 OK):**
```json
{
  "linkedin": "Excited to announce the launch of our new AI tool! 🚀...",
  "instagram": "Big news! 🎉 Our new AI tool is finally here...",
  "x": "Write code 10x faster with our new AI tool! 💻✨ #AI #DevTools...",
  "youtube": {
    "title": "Write Code 10x Faster with Our New AI Tool!",
    "description": "In this video, we introduce...",
    "tags": ["AI", "Coding", "Software Development"],
    "outline": "1. Hook\n2. Introduction\n3. Feature Demo\n4. Call to Action"
  }
}
```

## Example Input/Output
- **Input Content**: "Just finished reading a great book on time management. The biggest takeaway was the Pomodoro technique - working for 25 minutes and taking a 5 minute break."
- **Output (X)**: "Struggling with time management? Try the Pomodoro technique! 🍅 Work for 25 mins, rest for 5. It's a game-changer for productivity. #TimeManagement #ProductivityTips"
- **Output (LinkedIn)**: "I recently finished a fantastic book on time management, and I wanted to share my biggest takeaway with my network: the Pomodoro Technique. By working in focused 25-minute intervals followed by a 5-minute break, I've seen a massive boost in my daily output. Have you tried it? Let me know your thoughts below. 👇"

## Future Improvements
- Support for generating images for Instagram/X using an image generation model.
- OAuth integration to post directly to social media accounts.
- User accounts to save past generated content and custom instructions.
