NorthStar: AI-Powered Scholarship Success Platform

Helping students navigate scholarships and craft winning applications with AI-driven guidance.

NorthStar is a web application that leverages AI (Anthropic’s Claude) to guide students through finding the right scholarships and writing tailored application essays. It matches a student’s profile to relevant scholarship opportunities, uncovers each scholarship’s hidden selection criteria, and generates personalized essay drafts aligned with what selection committees value. (Developed as part of the November 2025 Anthropic AI Hackathon.)

Features

Smart Scholarship Matching: Recommends the best-fit scholarships based on a student’s background, activities, and interests.

Implicit Priority Analysis: Reveals what each scholarship truly prioritizes (e.g. leadership, financial need, community service) by analyzing descriptions and context.

Real Winner Personas: Offers writing “personas” inspired by patterns from real scholarship winners (e.g. Community Builder, Innovator, Overcoming Adversity) to shape the essay’s tone and approach.

AI-Assisted Essay Drafting: Uses Claude AI to generate a tailored scholarship essay draft highlighting the student’s strengths in light of the scholarship’s priorities, with tools for refinement and editing.

Tech Stack

Frontend: React (JavaScript/TypeScript)

Backend: Python (FastAPI framework)

AI: Anthropic Claude API (for natural language analysis and generation)

Database: Supabase (PostgreSQL) for storing scholarship data (optional for deployment)

Installation & Setup
Prerequisites

Node.js (v16+ recommended) and NPM (for running the React frontend)

Python (3.9+ recommended, for the FastAPI backend)

An Anthropic Claude API Key (sign up for an API key to enable AI features)

(Optional) A Supabase account and project, if you plan to use Supabase for data storage.

Backend Setup (FastAPI)

Clone the repository:

git clone https://github.com/kikotc/NorthStar.git
cd NorthStar/backend


Create a virtual environment (optional, but recommended):

python3 -m venv venv 
source venv/bin/activate   # On Windows: venv\Scripts\activate


Install backend dependencies:

pip install -r requirements.txt


This will install FastAPI, Uvicorn, and other required libraries (including the Anthropic AI SDK or HTTP client for Claude).

Configure environment variables: NorthStar’s backend expects certain keys to be set for external services. Create a file named .env in the backend directory (or set environment variables in your OS) with the following contents:

ANTHROPIC_API_KEY=<your_claude_api_key>
SUPABASE_URL=<your_supabase_project_url>         # e.g. https://xyzcompany.supabase.co (if using Supabase)
SUPABASE_ANON_KEY=<your_supabase_anon_public_key> # if using Supabase


ANTHROPIC_API_KEY is required to enable Claude’s API calls. (Without it, the AI analysis/generation features will not work.)

SUPABASE_URL and SUPABASE_ANON_KEY are optional. If provided, the backend will attempt to fetch scholarship data from your Supabase instance. If you prefer not to use Supabase, the app can fall back on local sample data (ensure the data/ folder is populated with example scholarships).

Run the backend server:

uvicorn main:app --reload


This starts the FastAPI server on localhost:8000 (by default). You should see console output from Uvicorn indicating the server is running. The API documentation is available at http://localhost:8000/docs (interactive Swagger UI).

Frontend Setup (React)

Open a new terminal (separate from the backend) and navigate to the project’s frontend directory:

cd NorthStar/frontend


Install frontend dependencies:

npm install


This will download and install the React app’s required packages (React, Redux or state libraries if used, etc.).

Configure frontend (if needed):
By default, the React app is configured to request data from the local backend at http://localhost:8000. If you deployed the backend separately or use a different address, update the API endpoint URL in the frontend code (e.g. in an environment file or configuration section). For development with the default setup, no changes are needed.

Start the development server:

npm start


This will launch the React app on localhost:3000. You should see output in the terminal and your browser opening http://localhost:3000. If it doesn’t open automatically, visit that URL in your web browser.

Usage Guide

Once both the backend and frontend are running, you can begin using NorthStar:

Open the app in your browser at http://localhost:3000.

Create a Student Profile: You’ll be prompted to enter your academic and personal background — such as major, GPA, experiences, and interests. (You may also have the option to load a pre-filled sample profile for testing.)

Find Matching Scholarships: After submitting your profile, NorthStar will display a list of scholarship opportunities. These may be sorted by a “fit score” indicating how well your profile matches each scholarship. You can browse through the list or search/filter to find one that interests you.

View Scholarship Priorities: Select a scholarship from the list (or paste a scholarship description if that option is provided). NorthStar will analyze the scholarship’s description and show you its inferred implicit priorities – for example, it might reveal that a particular award values Leadership (40%), Financial Need (35%), and Community Service (25%). This gives you insight into what the selection committee cares about. You’ll also see a personalized match score and/or gap analysis pointing out how well your profile covers those areas (e.g. highlighting if you haven’t mentioned a high-priority trait like community service).

Generate a Tailored Essay Draft: With one click, ask Claude (the AI) to generate a scholarship essay draft for the selected opportunity. The system will use your profile details and the scholarship’s priorities to create a first draft that emphasizes the right themes. If available, choose a writing persona before generating – for instance, Community Builder might yield an essay focusing on service and teamwork, whereas Innovator might highlight creativity and problem-solving.

Review and Refine: The draft essay will appear in an editor on the screen. You can read it and make any edits directly. NorthStar’s AI can assist in refining the tone or structure — for example, you might adjust a slider or setting for a more formal vs. personal tone, or hit a “Regenerate with different emphasis” button to produce an alternative version. (All AI generation stays within ethical guidelines and uses your experiences – it’s meant to help express your story more effectively, not fabricate content.)

Finalize Your Application: Use the AI-refined essay as a strong starting point. You can copy the text out for your scholarship application and tweak it further if needed. With a clearer understanding of what the scholarship is looking for and a tailored essay in hand, you’re set up for a more confident submission!

Note: An internet connection is required while running the app, as the backend needs to call the Claude API (and Supabase, if used) in real-time. Each AI analysis or generation may take a few seconds as it processes through the Claude model.

Data and AI Methodology

Scholarship Data: We compiled a dataset of about 30 scholarships, including their public descriptions, criteria, and other details, to power NorthStar’s matching and analysis. These scholarship profiles can be stored in the Supabase database or loaded from local files in the data/ directory. They serve as the pool from which the app recommends opportunities. Feel free to augment this list with additional scholarships or import your own dataset into the database.

Real Winner Essays: To inform the essay-writing guidance, we reviewed several publicly available scholarship-winning essays and recipient stories. This research helped us identify common narrative personas and effective storytelling techniques. (For example, many winning essays either highlight community impact, innovative projects, or personal resilience.) We distilled these patterns into the selectable “writing personas” and used them to shape the prompts given to Claude.

Prompt Engineering: NorthStar uses carefully engineered prompts when calling Claude’s API. For the priority analysis, the backend prompt might instruct Claude to read a scholarship description and output a JSON with key qualities and suggested weightings. For essay generation, the prompt combines the scholarship’s priorities with the student’s profile and a chosen persona, asking Claude to produce a personalized essay draft. These prompts were iteratively refined to ensure the outputs remain relevant, coherent, and authentic to the student’s voice. All AI generation is done dynamically via Claude’s API (no fine-tuned model training was required for this hackathon project).

Ethical Considerations: We enforce that the AI does not fabricate achievements or credentials – it only uses the information provided by the user. Claude’s role is to help articulate the student’s own experiences in the most compelling way for each opportunity.

Project Structure

The repository is organized into frontend and backend portions, with a data folder for resources:

NorthStar/
├── backend/             # Backend API (FastAPI)
│   ├── main.py          # Entry point for the FastAPI app (defines endpoints)
│   ├── app/             # (if used) Python modules for routing, services, etc.
│   ├── prompts.py       # (example) Prompt templates for AI calls (analysis & generation)
│   ├── utils/           # (example) Utility functions (e.g. for scoring, data fetch)
│   ├── data/            # Sample data files used by the backend (if not using DB)
│   └── requirements.txt # Python dependencies for the backend
├── frontend/            # Frontend React application
│   ├── public/          # Static public assets (HTML, icons, etc.)
│   ├── src/             # React source code
│   │   ├── components/  # UI components (forms, results display, etc.)
│   │   ├── pages/       # Page or view components (Profile form, Scholarships list, Essay editor)
│   │   ├── hooks/       # (if used) custom React hooks
│   │   ├── utils/       # helper functions (e.g. API client code)
│   │   ├── App.js       # Main React app component
│   │   └── ...other files (styles, state management, etc.)
│   ├── package.json     # Frontend dependencies and scripts
│   └── ...other config files (e.g. .env.example for API keys, if provided)
└── data/                # Data assets (outside of app code)
    ├── scholarships_sample.json    # Sample scholarship descriptions (for initial load or testing)
    ├── sample_profiles.json       # Sample student profiles for testing
    └── example_winners/           # Example winning essays or notes for persona derivation


(Note: The exact structure and file names may differ slightly in the repository, but the above overview captures the general layout and key components.)

Deployment

Deploying NorthStar for production or demo is straightforward, as the frontend and backend are decoupled:

Frontend Deployment: Build the React app for production with npm run build. This generates static files in the frontend/build directory. You can then deploy these via any static site hosting (e.g. Netlify, Vercel, GitHub Pages). For example, on Netlify you can simply drag-and-drop the build folder or connect the GitHub repo for continuous deployment. Ensure to set an environment variable or adjust the frontend code to point to the live backend URL if it’s not running on the root domain.

Backend Deployment: The FastAPI app can be containerized or deployed directly to a cloud service. You can use platforms like Heroku, Railway, Render, or AWS to host the Python backend. For instance, to deploy on Heroku, you might create a Procfile with uvicorn main:app --workers 1 --port $PORT and push the repo. Ensure to add the necessary config vars (ANTHROPIC_API_KEY, etc.) in your hosting environment. If using Docker, write a Dockerfile based on a Python image, install requirements, and run Uvicorn. The backend must be accessible over HTTPS for the React app in production.

Supabase: If using Supabase in production, configure the URL and anon key in the deployed backend’s environment. You should populate your Supabase database with the scholarship data beforehand (either via the SQL import or using the admin UI to add rows). For a quick start, you can insert the sample scholarships provided in the data/ folder. Make sure your Supabase project’s RLS (Row Level Security) is configured to allow the needed read operations (or disable RLS for the scholarship table for simplicity during testing).

CORS Settings: In production, update the FastAPI CORS settings (if not already dynamic) to allow the domain where your frontend is hosted. During development, we typically allow http://localhost:3000 – in production, you might allow your Netlify/Vercel domain.

Once deployed, the workflow remains the same: users enter their profile, get scholarship matches, and generate essays – except now it can be accessed via a public URL. We recommend securing your Anthropic API key and any sensitive variables in your server configuration and not exposing them in the frontend.
