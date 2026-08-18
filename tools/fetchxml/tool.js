let selectedColumns = [];
let filters = [];
let filterCount = 0;

function toggleColumn(btn, columnName) {
  if (selectedColumns.includes(columnName)) {
    selectedColumns = selectedColumns.filter(c => c !== columnName);
    btn.style.background = "var(--card)";
    btn.style.borderColor = "var(--line)";
  } else {
    selectedColumns.push(columnName);
    btn.style.background = "rgba(0, 82, 204, 0.15)";
    btn.style.borderColor = "var(--accent)";
  }
}

function addFilter() {
  const filterId = `filter-${filterCount++}`;
  
  const filterDiv = document.createElement("div");
  filterDiv.className = "filter-item";
  filterDiv.id = filterId;
  filterDiv.innerHTML = `
    <div class="filter-item-header">
      <span style="font-weight: 600;">Condition ${filters.length + 1}</span>
      <button class="btn btn-secondary" onclick="removeFilter('${filterId}')">Remove</button>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem;">
      <input type="text" placeholder="Column" class="filter-attr" value="">
      <select class="filter-op">
        <option value="eq">equals</option>
        <option value="ne">not equals</option>
        <option value="gt">greater than</option>
        <option value="lt">less than</option>
        <option value="like">contains</option>
        <option value="begins-with">begins with</option>
      </select>
      <input type="text" placeholder="Value" class="filter-val" value="">
    </div>
  `;
  
  document.getElementById("filters-container").appendChild(filterDiv);
  filters.push({ id: filterId, attr: "", op: "eq", val: "" });
}

function removeFilter(filterId) {
  const elem = document.getElementById(filterId);
  if (elem) elem.remove();
  filters = filters.filter(f => f.id !== filterId);
}

function generateFetchXml() {
  const entity = document.getElementById("entity-select").value;
  
  if (!entity) {
    alert("Please select an entity first");
    return;
  }

  let fetchXml = `<fetch version="1.0" output-format="xml-platform" mapping="logical">\n`;
  fetchXml += `  <entity name="${entity}">\n`;

  // Add columns
  if (selectedColumns.length === 0) {
    fetchXml += `    <all-attributes />\n`;
  } else {
    selectedColumns.forEach(col => {
      fetchXml += `    <attribute name="${col}" />\n`;
    });
  }

  // Add filters
  const filterElements = document.querySelectorAll(".filter-item");
  if (filterElements.length > 0) {
    fetchXml += `    <filter type="and">\n`;
    
    filterElements.forEach(filterEl => {
      const attr = filterEl.querySelector(".filter-attr").value;
      const op = filterEl.querySelector(".filter-op").value;
      const val = filterEl.querySelector(".filter-val").value;
      
      if (attr && val) {
        if (op === "like") {
          fetchXml += `      <condition attribute="${attr}" operator="like" value="%${val}%" />\n`;
        } else if (op === "begins-with") {
          fetchXml += `      <condition attribute="${attr}" operator="begins-with" value="${val}" />\n`;
        } else {
          fetchXml += `      <condition attribute="${attr}" operator="${op}" value="${val}" />\n`;
        }
      }
    });
    
    fetchXml += `    </filter>\n`;
  }

  // Add order
  const orderBy = document.getElementById("order-by").value.trim();
  if (orderBy) {
    const orders = orderBy.split(",");
    orders.forEach(order => {
      const [attr, dir] = order.trim().split(/\s+/);
      if (attr) {
        fetchXml += `    <order attribute="${attr}" descending="${dir && dir.toLowerCase() === 'desc' ? 'true' : 'false'}" />\n`;
      }
    });
  }

  // Add paging
  const pageSize = document.getElementById("page-size").value;
  fetchXml += `    <paging count="${pageSize}" page="1" />\n`;

  fetchXml += `  </entity>\n`;
  fetchXml += `</fetch>`;

  document.getElementById("query-output").value = fetchXml;
  showCopyStatus();
}

function generateOData() {
  const entity = document.getElementById("entity-select").value;
  
  if (!entity) {
    alert("Please select an entity first");
    return;
  }

  let odata = `/api/data/v9.0/${entity}?`;
  const params = [];

  // Add select
  if (selectedColumns.length > 0) {
    params.push(`$select=${selectedColumns.join(",")}`);
  }

  // Add filter
  const filterElements = document.querySelectorAll(".filter-item");
  if (filterElements.length > 0) {
    const conditions = [];
    filterElements.forEach(filterEl => {
      const attr = filterEl.querySelector(".filter-attr").value;
      const op = filterEl.querySelector(".filter-op").value;
      const val = filterEl.querySelector(".filter-val").value;
      
      if (attr && val) {
        if (op === "like") {
          conditions.push(`contains(${attr}, '${val}')`);
        } else if (op === "begins-with") {
          conditions.push(`startswith(${attr}, '${val}')`);
        } else if (op === "eq") {
          conditions.push(`${attr} eq '${val}'`);
        } else if (op === "ne") {
          conditions.push(`${attr} ne '${val}'`);
        } else if (op === "gt") {
          conditions.push(`${attr} gt ${isNaN(val) ? `'${val}'` : val}`);
        } else if (op === "lt") {
          conditions.push(`${attr} lt ${isNaN(val) ? `'${val}'` : val}`);
        }
      }
    });
    
    if (conditions.length > 0) {
      params.push(`$filter=${conditions.join(" and ")}`);
    }
  }

  // Add order
  const orderBy = document.getElementById("order-by").value.trim();
  if (orderBy) {
    params.push(`$orderby=${orderBy}`);
  }

  // Add top
  const pageSize = document.getElementById("page-size").value;
  params.push(`$top=${pageSize}`);

  odata += params.join("&");

  document.getElementById("query-output").value = odata;
  showCopyStatus();
}

function copyQuery() {
  const output = document.getElementById("query-output");
  output.select();
  navigator.clipboard.writeText(output.value).then(() => {
    showCopyStatus();
  });
}

function showCopyStatus() {
  const status = document.getElementById("copy-status");
  status.style.display = "block";
  setTimeout(() => {
    status.style.display = "none";
  }, 2000);
}

function downloadQuery() {
  const output = document.getElementById("query-output").value;
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(output));
  element.setAttribute("download", "query.xml");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function clearBuilder() {
  selectedColumns = [];
  filters = [];
  filterCount = 0;
  
  document.getElementById("entity-select").value = "";
  document.getElementById("filters-container").innerHTML = "";
  document.getElementById("order-by").value = "";
  document.getElementById("page-size").value = "500";
  document.getElementById("query-output").value = "";
  
  document.querySelectorAll(".attribute-btn").forEach(btn => {
    btn.style.background = "var(--card)";
    btn.style.borderColor = "var(--line)";
  });
}
