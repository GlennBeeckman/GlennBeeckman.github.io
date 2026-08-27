const powerFxFunctions = [
  {
    name: "If",
    category: "Logic",
    syntax: "If(condition, value_if_true, value_if_false)",
    description: "Returns one value if a condition is true and another if it's false.",
    parameters: [
      { name: "condition", desc: "Boolean expression to evaluate" },
      { name: "value_if_true", desc: "Value returned if condition is true" },
      { name: "value_if_false", desc: "Value returned if condition is false" }
    ],
    example: 'If(Age >= 18, "Adult", "Minor")',
    returnType: "Any"
  },
  {
    name: "Filter",
    category: "Table",
    syntax: "Filter(table, condition1, [condition2], ...)",
    description: "Returns a filtered table based on one or more conditions.",
    parameters: [
      { name: "table", desc: "The source table to filter" },
      { name: "condition", desc: "Logical condition to evaluate for each row" }
    ],
    example: 'Filter(Accounts, Status = "Active")',
    returnType: "Table"
  },
  {
    name: "Sort",
    category: "Table",
    syntax: "Sort(table, formula, [order])",
    description: "Returns a sorted copy of a table.",
    parameters: [
      { name: "table", desc: "The source table" },
      { name: "formula", desc: "The column to sort by" },
      { name: "order", desc: "Optional: Ascending (default) or Descending" }
    ],
    example: 'Sort(Contacts, Name, Ascending)',
    returnType: "Table"
  },
  {
    name: "LookUp",
    category: "Table",
    syntax: "LookUp(table, condition, [result])",
    description: "Finds the first record in a table that matches a condition.",
    parameters: [
      { name: "table", desc: "The table to search" },
      { name: "condition", desc: "Logical condition to match" },
      { name: "result", desc: "Optional: Column to return (default: entire record)" }
    ],
    example: 'LookUp(Contacts, Email = "user@example.com", Name)',
    returnType: "Record or Value"
  },
  {
    name: "Patch",
    category: "Data",
    syntax: "Patch(data_source, record, changes_record1, [changes_record2], ...)",
    description: "Creates or updates records in a data source.",
    parameters: [
      { name: "data_source", desc: "The table to update" },
      { name: "record", desc: "The record to update" },
      { name: "changes", desc: "Column changes to apply" }
    ],
    example: 'Patch(Contacts, CurrentRecord, { Status: "Active" })',
    returnType: "Record"
  },
  {
    name: "Collect",
    category: "Collection",
    syntax: "Collect(collection, record1, [record2], ...)",
    description: "Adds records to a collection.",
    parameters: [
      { name: "collection", desc: "Target collection" },
      { name: "record", desc: "Record(s) to add" }
    ],
    example: 'Collect(MyCollection, { Name: "John", Age: 30 })',
    returnType: "Collection"
  },
  {
    name: "Clear",
    category: "Collection",
    syntax: "Clear(collection)",
    description: "Deletes all records from a collection.",
    parameters: [
      { name: "collection", desc: "Collection to clear" }
    ],
    example: 'Clear(MyCollection)',
    returnType: "Boolean"
  },
  {
    name: "Text",
    category: "Text",
    syntax: "Text(value, format_code, [language])",
    description: "Converts a value to a text string formatted according to a format code.",
    parameters: [
      { name: "value", desc: "The value to convert" },
      { name: "format_code", desc: "Format string (e.g., 'mmmm dd, yyyy')" }
    ],
    example: 'Text(Today(), "mmmm dd, yyyy")',
    returnType: "Text"
  },
  {
    name: "Len",
    category: "Text",
    syntax: "Len(text)",
    description: "Returns the number of characters in a text string.",
    parameters: [
      { name: "text", desc: "Text string to measure" }
    ],
    example: 'Len("Hello") // Returns 5',
    returnType: "Number"
  },
  {
    name: "Concatenate",
    category: "Text",
    syntax: "Concatenate(text1, text2, ...)",
    description: "Combines multiple text strings into one.",
    parameters: [
      { name: "text", desc: "Text strings to combine" }
    ],
    example: 'Concatenate("Hello ", "World")',
    returnType: "Text"
  },
  {
    name: "Substitute",
    category: "Text",
    syntax: "Substitute(text, old_text, new_text)",
    description: "Replaces occurrences of text within a string.",
    parameters: [
      { name: "text", desc: "Original text" },
      { name: "old_text", desc: "Text to replace" },
      { name: "new_text", desc: "Replacement text" }
    ],
    example: 'Substitute("Hello World", "World", "Universe")',
    returnType: "Text"
  },
  {
    name: "Now",
    category: "Date",
    syntax: "Now()",
    description: "Returns the current date and time.",
    parameters: [],
    example: 'Now() // e.g., 6/11/2026 2:30:45 PM',
    returnType: "DateTime"
  },
  {
    name: "Today",
    category: "Date",
    syntax: "Today()",
    description: "Returns the current date (without time).",
    parameters: [],
    example: 'Today() // e.g., 6/11/2026',
    returnType: "Date"
  },
  {
    name: "DateAdd",
    category: "Date",
    syntax: "DateAdd(date, days, [time_unit])",
    description: "Adds days, months, or years to a date.",
    parameters: [
      { name: "date", desc: "Starting date" },
      { name: "days", desc: "Number to add" },
      { name: "time_unit", desc: "Optional: Days (default), Months, Years, Hours, Minutes, Seconds" }
    ],
    example: 'DateAdd(Today(), 7) // Add 7 days',
    returnType: "DateTime"
  },
  {
    name: "Concatenate or &",
    category: "Text",
    syntax: 'FirstName & " " & LastName',
    description: "Concatenates strings using the ampersand operator.",
    parameters: [],
    example: '"John" & " " & "Doe"',
    returnType: "Text"
  },
  {
    name: "Sum",
    category: "Math",
    syntax: "Sum(table, column)",
    description: "Returns the sum of all values in a column.",
    parameters: [
      { name: "table", desc: "Table containing the column" },
      { name: "column", desc: "Column to sum" }
    ],
    example: 'Sum(Orders, Amount)',
    returnType: "Number"
  },
  {
    name: "CountRows",
    category: "Table",
    syntax: "CountRows(table)",
    description: "Returns the number of rows in a table or collection.",
    parameters: [
      { name: "table", desc: "Table to count" }
    ],
    example: 'CountRows(Contacts)',
    returnType: "Number"
  },
  {
    name: "IsBlank",
    category: "Logic",
    syntax: "IsBlank(value)",
    description: "Returns true if a value is blank or empty.",
    parameters: [
      { name: "value", desc: "Value to test" }
    ],
    example: 'IsBlank(TextInput.Value)',
    returnType: "Boolean"
  },
  {
    name: "IfError",
    category: "Logic",
    syntax: "IfError(formula, fallback)",
    description: "Returns a fallback value if the formula results in an error.",
    parameters: [
      { name: "formula", desc: "Formula to evaluate" },
      { name: "fallback", desc: "Value to return if error occurs" }
    ],
    example: 'IfError(1/0, "Error occurred")',
    returnType: "Any"
  },
  {
    name: "And",
    category: "Logic",
    syntax: "And(condition1, condition2, ...)",
    description: "Returns true if all conditions are true.",
    parameters: [
      { name: "condition", desc: "Logical conditions to evaluate" }
    ],
    example: 'And(Age > 18, Status = "Active")',
    returnType: "Boolean"
  },
  {
    name: "Or",
    category: "Logic",
    syntax: "Or(condition1, condition2, ...)",
    description: "Returns true if any condition is true.",
    parameters: [
      { name: "condition", desc: "Logical conditions to evaluate" }
    ],
    example: 'Or(Status = "New", Status = "Pending")',
    returnType: "Boolean"
  },
  {
    name: "Navigate",
    category: "Navigation",
    syntax: "Navigate(screen, transition, [context])",
    description: "Navigates to another screen in the app.",
    parameters: [
      { name: "screen", desc: "Target screen" },
      { name: "transition", desc: "Animation type (Fade, Pop, etc.)" },
      { name: "context", desc: "Optional: Data to pass to screen" }
    ],
    example: 'Navigate(DetailsScreen, Fade, { Item: Gallery.Selected })',
    returnType: "Boolean"
  }
];

let filteredFunctions = [...powerFxFunctions];
let activeCategory = "all";

// Initialize category filter buttons
function initCategories() {
  const categories = [...new Set(powerFxFunctions.map(f => f.category))];
  const filterDiv = document.getElementById("category-filter");
  
  filterDiv.innerHTML = '<button class="category-btn active" onclick="filterByCategory(\'all\')">All</button>' +
    categories.map(cat => `<button class="category-btn" onclick="filterByCategory('${cat}')">${cat}</button>`).join("");
}

function filterByCategory(category) {
  activeCategory = category;
  
  document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  
  filterAndRender();
}

function filterAndRender() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  
  filteredFunctions = powerFxFunctions.filter(func => {
    const matchesCategory = activeCategory === "all" || func.category === activeCategory;
    const matchesSearch = !searchTerm || 
      func.name.toLowerCase().includes(searchTerm) ||
      func.description.toLowerCase().includes(searchTerm);
    
    return matchesCategory && matchesSearch;
  });

  renderList();
}

function renderList() {
  const list = document.getElementById("func-list");
  
  if (filteredFunctions.length === 0) {
    list.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-light);">No functions found</div>';
    return;
  }

  list.innerHTML = filteredFunctions.map((func, idx) => `
    <div class="func-item" onclick="showDetail(${idx})">
      <div class="func-name">${func.name}()</div>
      <div class="func-category">${func.category}</div>
    </div>
  `).join("");
}

function showDetail(index) {
  const func = filteredFunctions[index];
  const panel = document.getElementById("detail-panel");

  let html = `
    <div class="detail-header">
      <div class="detail-title">${func.name}()</div>
      <div style="background: rgba(0, 82, 204, 0.1); display: inline-block; padding: 0.3rem 0.7rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; color: var(--accent);">${func.category}</div>
    </div>

    <div class="detail-syntax">${func.syntax}</div>

    <div class="detail-section">
      <div class="detail-section-title">Description</div>
      <div class="detail-text">${func.description}</div>
    </div>
  `;

  if (func.parameters.length > 0) {
    html += `
      <div class="detail-section">
        <div class="detail-section-title">Parameters</div>
        <div class="param-list">
          ${func.parameters.map(p => `
            <div class="param-item">
              <div class="param-name">${p.name}</div>
              <div class="param-desc">${p.desc}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  html += `
    <div class="detail-section">
      <div class="detail-section-title">Example</div>
      <div style="background: #f0f4f9; padding: 1rem; border-radius: 6px; font-family: 'Fira Code', monospace; font-size: 0.85rem; word-break: break-word;">${func.example}</div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">Returns</div>
      <div class="detail-text">${func.returnType}</div>
    </div>
  `;

  panel.innerHTML = html;

  // Update active state
  document.querySelectorAll(".func-item").forEach(el => el.classList.remove("active"));
  event.currentTarget.classList.add("active");
}

// Event listeners
document.getElementById("search-input").addEventListener("input", filterAndRender);

// Initialize
initCategories();
renderList();
