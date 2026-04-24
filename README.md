# SRM BFHL - Full Stack Challenge

## 1. Overview
The **SRM BFHL** project is a comprehensive full-stack solution designed for the Bajaj Finserv Health Limited (BFHL) qualifier challenge. It features a robust Node.js/Express backend that processes complex hierarchical edge data to construct tree structures, detect cycles, and identify deepest hierarchies. The frontend provides a modern, interactive dashboard for data visualization and error tracking, ensuring a seamless experience for interpreting structured relationship data.

## 2. Tech Stack
- **Backend**: Node.js, Express.js
- **Frontend**: Vue.js (CDN), Vanilla CSS3, HTML5
- **Utilities**: CORS, Custom Recursive Tree Logic

## 3. Project Structure
```text
├── backend/
│   ├── index.js          # Entry point (Express Setup)
│   ├── routes/
│   │   └── bfhl.js       # API Routes
│   ├── utils/
│   │   └── processor.js  # Core Logic (Trees & Cycles)
│   ├── test.js           # API Test Script
│   └── package.json      # Backend Dependencies
├── frontend/
│   ├── index.html        # Vue UI Structure
│   ├── style.css         # Dark Theme Styling
│   ├── app.js            # Vue logic & Tree Rendering
│   └── package.json      # Frontend Dev Scripts
├── .gitignore            # Git exclusion rules
└── README.md             # Documentation
```

## 4. Local Setup

### Start the Backend
1. Open your terminal.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *The server will run on `http://localhost:3000`.*

### Start the Frontend
You can either open `frontend/index.html` directly or use the dev server:
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

## 5. Testing
A verification script is provided to test the API logic.
1. Ensure the backend is running.
2. In a new terminal:
   ```bash
   cd backend
   node test.js
   ```

---

## 6. API Reference

### POST `/bfhl`
Processes an array of edges and returns hierarchical structures.

**Example Request Body:**
```json
{
  "data": ["A->B", "B->C", "A->D", "hello"]
}
```

**Example Success Response:**
```json
{
  "user_id": "yourname_ddmmyyyy",
  "email_id": "your@email.com",
  "college_roll_number": "ROLLNUMBER",
  "hierarchies": [
    {
      "root": "A",
      "tree": { "A": { "B": { "C": {} }, "D": {} } },
      "depth": 3
    }
  ],
  "invalid_entries": ["hello"],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

---

## 7. Notes
- **CORS Handling**: Cross-Origin Resource Sharing is enabled for all origins.
- **Dynamic Logic**: All tree and cycle logic is computed dynamically via the `processor.js` utility.
- **Self-Loops**: Entries like `A->A` are automatically caught as invalid.
- **Diamond Rule**: If a child has multiple parents, the first parent encountered in the input wins.
