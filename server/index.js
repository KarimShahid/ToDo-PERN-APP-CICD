require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./connect_server_and_database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(cors());
app.use(express.json());

// Get JWT Secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// Validate JWT_SECRET exists
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
  process.exit(1);
}

// Register User
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  console.log("Register attempt:", { username });
  
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user into database
    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );
    
    console.log("User created successfully:", { 
      user_id: newUser.rows[0].user_id, 
      username: newUser.rows[0].username 
    });
    
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error("Registration error:", err.message);
    
    // Check for duplicate username error
    if (err.code === '23505') {
      return res.status(400).json({ error: "Username already exists" });
    }
    
    res.status(500).json({ error: "Server Error" });
  }
});

// Login User
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", { username });
  
  try {
    // Find user by username
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    
    if (user.rows.length === 0) {
      console.log("Login failed: User not found");
      return res.status(400).json({ error: "Invalid username or password" });
    }
    
    // Compare password with hashed password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    
    if (!validPassword) {
      console.log("Login failed: Invalid password");
      return res.status(400).json({ error: "Invalid username or password" });
    }
    
    // Create JWT token
    const token = jwt.sign({ id: user.rows[0].user_id }, JWT_SECRET, {
      expiresIn: '24h' // Token expires in 24 hours
    });
    
    console.log("Login successful:", { user_id: user.rows[0].user_id });
    
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  
  if (!token) {
    console.log("Access denied: No token provided");
    return res.status(401).json({ error: "Access denied: No token provided" });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Invalid token:", err.message);
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    
    req.user = user;
    next();
  });
};

// Create a todo (protected route)
app.post("/todos", authenticateToken, async (req, res) => {
  const { description, due_date, priority, category } = req.body;
  console.log("Add todo attempt:", {
    description,
    due_date,
    priority,
    category,
    user_id: req.user.id,
  });
  
  try {
    const newTodo = await pool.query(
      "INSERT INTO todo (user_id, description, due_date, priority, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.user.id, description, due_date, priority || "Low", category]
    );
    
    console.log("Todo created:", newTodo.rows[0]);
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error("Todo creation error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Get all todos for the logged-in user (protected route)
app.get("/todos", authenticateToken, async (req, res) => {
  console.log("Fetch todos attempt for user:", req.user.id);
  
  try {
    const allTodos = await pool.query(
      "SELECT * FROM todo WHERE user_id = $1 ORDER BY due_date ASC NULLS LAST",
      [req.user.id]
    );
    
    console.log("Todos fetched:", allTodos.rows.length, "items");
    res.json(allTodos.rows);
  } catch (err) {
    console.error("Todo fetch error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Update a todo (protected route)
app.put("/todos/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { description, due_date, priority, category, completed } = req.body;
    
    console.log("Update todo attempt:", { todo_id: id, user_id: req.user.id });
    
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1, due_date = $2, priority = $3, category = $4, completed = $5 WHERE todo_id = $6 AND user_id = $7 RETURNING *",
      [description, due_date, priority, category, completed, id, req.user.id]
    );
    
    if (updateTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found or unauthorized" });
    }
    
    console.log("Todo updated successfully");
    res.json(updateTodo.rows[0]);
  } catch (err) {
    console.error("Todo update error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Delete a todo (protected route)
app.delete("/todos/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("Delete todo attempt:", { todo_id: id, user_id: req.user.id });
    
    const deleteTodo = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );
    
    if (deleteTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found or unauthorized" });
    }
    
    console.log("Todo deleted successfully");
    res.json({ message: "Todo was deleted successfully" });
  } catch (err) {
    console.error("Todo delete error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Export todos (protected route)
app.get("/export", authenticateToken, async (req, res) => {
  try {
    console.log("Export todos attempt for user:", req.user.id);
    
    const todos = await pool.query("SELECT * FROM todo WHERE user_id = $1", [
      req.user.id,
    ]);
    
    console.log("Todos exported:", todos.rows.length, "items");
    res.json(todos.rows);
  } catch (err) {
    console.error("Export error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Import todos (protected route)
app.post("/import", authenticateToken, async (req, res) => {
  const { todos } = req.body;
  
  if (!Array.isArray(todos)) {
    return res.status(400).json({ error: "Invalid data format. Expected an array of todos." });
  }
  
  console.log("Import todos attempt for user:", req.user.id, "Count:", todos.length);
  
  try {
    let importedCount = 0;
    
    for (let todo of todos) {
      await pool.query(
        "INSERT INTO todo (user_id, description, due_date, priority, category, completed) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          req.user.id,
          todo.description,
          todo.due_date,
          todo.priority || "Low",
          todo.category,
          todo.completed || false,
        ]
      );
      importedCount++;
    }
    
    console.log("Todos imported successfully:", importedCount);
    res.json({ message: `${importedCount} todos imported successfully` });
  } catch (err) {
    console.error("Import error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});