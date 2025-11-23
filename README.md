# 🌟 NorthStar — AI-Powered Scholarship Success Platform
### _Helping students win scholarships with precision, clarity, and AI-driven essay mastery._

NorthStar is a full-stack web application that uses **Anthropic Claude** to help students **find the right scholarships**, decode what committees truly value, and generate **tailored, high-impact application essays**.  
Built for the **November 2025 Anthropic AI Hackathon**.

---

## 🚀 Features

### 🎯 Smart Scholarship Matching
Recommends the most relevant scholarships based on academic background, interests, activities, and achievements.

### 🔎 Implicit Priority Analysis
AI uncovers hidden evaluation criteria such as leadership, community service, financial need, resilience, and innovation.

### 🧬 Real Winner Personas
Selectable narrative styles inspired by real winning essays:
- Community Builder  
- Innovator  
- Overcoming Adversity  
- Academic Achiever  

### ✍️ AI-Assisted Essay Drafting
Claude generates a personalized scholarship essay draft aligned with each award’s priorities and the student’s authentic story.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React (JavaScript/TypeScript) |
| **Backend** | Python (FastAPI) |
| **AI** | Anthropic Claude API |
| **Database** | Supabase (PostgreSQL, optional) |

---

# 🛠️ Installation & Setup

## ✔️ Prerequisites
- Node.js (v16+) & npm  
- Python 3.9+  
- Anthropic API Key  
- (Optional) Supabase project  

---

## 🐍 Backend Setup (FastAPI)

```bash
git clone https://github.com/kikotc/NorthStar.git
cd NorthStar/backend
Create virtual environment:
bash
Copy code
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
Install dependencies:
bash
Copy code
pip install -r requirements.txt
Create .env:
ini
Copy code
ANTHROPIC_API_KEY=<your_key>
SUPABASE_URL=<optional_supabase_url>
SUPABASE_ANON_KEY=<optional_supabase_key>
Run backend:
bash
Copy code
uvicorn main:app --reload
API Docs → http://localhost:8000/docs

⚛️ Frontend Setup (React)
bash
Copy code
cd ../frontend
npm install
npm start
Frontend → http://localhost:3000

🎮 Usage Guide
1. Create Student Profile
Enter academic background, extracurriculars, and personal experiences.

2. Find Matching Scholarships
NorthStar recommends opportunities using a personalized “fit score.”

3. View Scholarship Priorities
AI extracts weighted criteria (e.g., Leadership 40%, Financial Need 35%, Service 25%).

4. Generate Essay Draft
Select a persona → Claude generates a tailored essay focused on what the committee values.

5. Refine & Edit
Edit, regenerate variations, tweak tone, or request AI improvements.

6. Finalize & Submit
Export the essay and use it in your real scholarship application.

🧠 Data & AI Methodology
📚 Scholarship Dataset
Includes ~30 curated scholarships stored via Supabase or local JSON.

📝 Winner Essay Insights
Persona generation is derived from publicly available winning essays and student success stories.

🤖 Prompt Engineering
Prompts include:

Priority extraction

Persona-based essay drafting

Tone refinement and gap analysis

🔒 Ethics
No fabricated achievements

AI stays aligned with student-provided experiences

Essays remain authentic and transparent

📂 Project Structure
kotlin
Copy code
NorthStar/
├── backend/
│   ├── main.py
│   ├── prompts.py
│   ├── utils/
│   ├── data/
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── App.js
└── data/
    ├── scholarships_sample.json
    ├── sample_profiles.json
    └── example_winners/
🌐 Deployment
🌩️ Frontend (Netlify / Vercel)
Build production bundle:

bash
Copy code
npm run build
Deploy the build/ directory.
Update API endpoint if backend is deployed separately.

🐳 Backend (Railway / Render / AWS / Heroku)
Example Heroku Procfile:

txt
Copy code
web: uvicorn main:app --workers 1 --port $PORT
Required environment variables:

nginx
Copy code
ANTHROPIC_API_KEY
SUPABASE_URL
SUPABASE_ANON_KEY
🗄️ Supabase (Optional)
Import scholarship dataset

Configure RLS for public read-only

Add URL & anon key in backend .env

🔐 CORS
Configure FastAPI CORS settings to allow your deployed frontend domain.

⭐ Final Note
NorthStar eliminates confusion around scholarships by helping students:

Identify opportunities that truly fit

Understand what committees prioritize

Craft essays that resonate and stand out

With AI-powered insights and tailored drafting, NorthStar transforms an overwhelming process into a strategic advantage.
