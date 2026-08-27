// Comprehensive Dataverse and Power Platform error codes
const errorCodes = [
  {
    code: "0x8004B00A",
    hex: "0x8004B00A",
    decimal: "-2147176438",
    title: "Access Denied",
    description: "You do not have permission to access this record or perform this action.",
    category: "security",
    solution: "Check your security role and field-level security settings. Verify you have Read, Create, Write, or Delete permissions as needed. Contact your system administrator.",
    tags: ["permission", "security", "unauthorized"]
  },
  {
    code: "0x80048304",
    hex: "0x80048304",
    decimal: "-2147187452",
    title: "Record Locked",
    description: "The record is locked by another process and cannot be modified.",
    category: "validation",
    solution: "Wait for the other process to complete. If the lock persists, check for stuck plugin executions or workflows. Restart the service if necessary.",
    tags: ["lock", "concurrent", "deadlock"]
  },
  {
    code: "0x8004F00E",
    hex: "0x8004F00E",
    decimal: "-2147159538",
    title: "Request Timeout",
    description: "The request did not complete within the timeout period.",
    category: "timeout",
    solution: "Optimize your query with better filtering. Reduce the number of rows retrieved. Check for plugins causing delays. Increase complexity gradually.",
    tags: ["timeout", "performance", "slow"]
  },
  {
    code: "0x80044151",
    hex: "0x80044151",
    decimal: "-2147204783",
    title: "Invalid Argument",
    description: "One or more arguments are invalid.",
    category: "validation",
    solution: "Check parameter types and values. Verify required fields are provided. Review error details for specific invalid argument.",
    tags: ["parameter", "invalid", "argument"]
  },
  {
    code: "0x80061104",
    hex: "0x80061104",
    decimal: "-2147102460",
    title: "Duplicate Detection",
    description: "A duplicate record was detected and the operation was blocked.",
    category: "validation",
    solution: "Enable duplicate detection or merge existing records. Check duplicate detection rules. Disable temporarily if needed for testing.",
    tags: ["duplicate", "merge", "detection"]
  },
  {
    code: "0x8004E002",
    hex: "0x8004E002",
    decimal: "-2147163134",
    title: "Plug-in Timeout",
    description: "The plug-in execution timed out.",
    category: "plugin",
    solution: "Optimize plugin code to run faster. Move long-running operations to async plugins. Remove heavy computations or database calls.",
    tags: ["plugin", "timeout", "performance"]
  },
  {
    code: "0x80045033",
    hex: "0x80045033",
    decimal: "-2147197903",
    title: "Bulk Operation Failed",
    description: "One or more records failed during bulk operation.",
    category: "validation",
    solution: "Check individual record errors. Verify data validation rules. Run single record to identify exact issue.",
    tags: ["bulk", "batch", "failed"]
  },
  {
    code: "0x8004F32A",
    hex: "0x8004F32A",
    decimal: "-2147158742",
    title: "No Active Subscription",
    description: "No valid subscription exists for this organization.",
    category: "security",
    solution: "Check organization subscription status. Verify license is active. Contact Microsoft support for subscription issues.",
    tags: ["subscription", "license", "organization"]
  },
  {
    code: "0x80060200",
    hex: "0x80060200",
    decimal: "-2147090944",
    title: "Invalid Customization",
    description: "The customization is invalid.",
    category: "validation",
    solution: "Check XML syntax in customizations. Verify entity/field names are correct. Use SiteMap Editor for UI customizations.",
    tags: ["customization", "xml", "syntax"]
  },
  {
    code: "0x80044505",
    hex: "0x80044505",
    decimal: "-2147202811",
    title: "Invalid User",
    description: "The user is invalid or has been disabled.",
    category: "security",
    solution: "Verify user account is active. Check user licensing. Ensure user has appropriate role assigned.",
    tags: ["user", "disabled", "inactive"]
  },
  {
    code: "0x80072560",
    hex: "0x80072560",
    decimal: "-2147015584",
    title: "Service Unavailable",
    description: "The service is temporarily unavailable.",
    category: "timeout",
    solution: "Retry the request after waiting. Check service status page. Contact Microsoft support if persistent.",
    tags: ["service", "unavailable", "maintenance"]
  },
  {
    code: "0x8004482F",
    hex: "0x8004482F",
    decimal: "-2147204161",
    title: "Required Field Missing",
    description: "A required field is missing or empty.",
    category: "validation",
    solution: "Populate all required fields before save. Check field requirements in form properties. Review business rules.",
    tags: ["required", "field", "validation"]
  },
  {
    code: "0x80044306",
    hex: "0x80044306",
    decimal: "-2147204346",
    title: "Object Not Found",
    description: "The object does not exist or has been deleted.",
    category: "validation",
    solution: "Verify the record ID exists. Check if record was deleted. Refresh the page or query.",
    tags: ["notfound", "missing", "deleted"]
  },
  {
    code: "0x8004B033",
    hex: "0x8004B033",
    decimal: "-2147176397",
    title: "Operation Not Allowed",
    description: "This operation is not allowed.",
    category: "security",
    solution: "Check security roles and privileges. Verify business rules aren't blocking. Check organization settings.",
    tags: ["notallowed", "forbidden", "blocked"]
  },
  {
    code: "0x80090350",
    hex: "0x80090350",
    decimal: "-2147163824",
    title: "Message Is Invalid",
    description: "The message request is invalid.",
    category: "validation",
    solution: "Check message parameters. Verify correct message name used. Check SDK documentation for required parameters.",
    tags: ["message", "invalid", "request"]
  },
  {
    code: "0x8004F00F",
    hex: "0x8004F00F",
    decimal: "-2147159537",
    title: "Maximum Batch Size Exceeded",
    description: "The batch size exceeds the maximum allowed.",
    category: "validation",
    solution: "Reduce batch size to max 1000 records. Split into multiple batches. Use pagination for large datasets.",
    tags: ["batch", "limit", "size"]
  },
  {
    code: "0x80048d09",
    hex: "0x80048d09",
    decimal: "-2147185911",
    title: "Invalid Authentication",
    description: "Authentication failed or credentials are invalid.",
    category: "security",
    solution: "Verify credentials are correct. Check connection string. Regenerate authentication tokens.",
    tags: ["auth", "credentials", "invalid"]
  },
  {
    code: "0x80060601",
    hex: "0x80060601",
    decimal: "-2147089919",
    title: "Solution Version Conflict",
    description: "A solution version conflict occurred.",
    category: "validation",
    solution: "Check solution versions. Export managed solution with higher version. Review layer management.",
    tags: ["solution", "version", "conflict"]
  },
  {
    code: "0x80044159",
    hex: "0x80044159",
    decimal: "-2147204775",
    title: "Invalid Entity",
    description: "The entity is invalid or does not exist.",
    category: "validation",
    solution: "Verify entity name is correct. Check entity is not hidden. Ensure entity is customizable if needed.",
    tags: ["entity", "invalid", "notfound"]
  },
  {
    code: "0x8004D299",
    hex: "0x8004D299",
    decimal: "-2147167591",
    title: "Application User Not Found",
    description: "The application user cannot be found.",
    category: "security",
    solution: "Create an application user in Settings > Users. Assign required security role. Check user licensing.",
    tags: ["appuser", "notfound", "application"]
  },
  {
    code: "0x80044160",
    hex: "0x80044160",
    decimal: "-2147204768",
    title: "Invalid Attribute",
    description: "The attribute is invalid or does not exist.",
    category: "validation",
    solution: "Check attribute name spelling. Verify attribute exists on entity. Ensure attribute is enabled.",
    tags: ["attribute", "field", "invalid"]
  },
  {
    code: "0x8004502C",
    hex: "0x8004502C",
    decimal: "-2147197908",
    title: "Invalid Lookup",
    description: "The lookup value is invalid.",
    category: "validation",
    solution: "Verify referenced record exists. Check target entity and field. Validate lookup relationship.",
    tags: ["lookup", "invalid", "reference"]
  },
  {
    code: "0x80048d0b",
    hex: "0x80048d0b",
    decimal: "-2147185909",
    title: "Invalid Request Format",
    description: "The request format is invalid.",
    category: "validation",
    solution: "Check JSON/XML format. Validate against schema. Review API documentation for correct format.",
    tags: ["format", "json", "xml"]
  },
  {
    code: "FLOW_RUNTIME_ERROR",
    hex: "N/A",
    decimal: "N/A",
    title: "Flow Runtime Error",
    description: "An error occurred during cloud flow execution.",
    category: "flow",
    solution: "Check flow run history. Enable verbose logging. Review action inputs/outputs. Check for missing inputs.",
    tags: ["flow", "cloud", "runtime"]
  },
  {
    code: "FLOW_THROTTLED",
    hex: "N/A",
    decimal: "N/A",
    title: "Flow Throttled",
    description: "The flow was throttled due to API limits.",
    category: "flow",
    solution: "Add delays between actions. Use pagination for large data. Implement retry logic. Upgrade licensing.",
    tags: ["flow", "throttle", "limit"]
  }
];

let filteredErrors = [...errorCodes];
let activeFilter = "all";

function renderErrors(errors) {
  const resultsDiv = document.getElementById("error-results");
  const infoDiv = document.getElementById("result-info");

  if (errors.length === 0) {
    resultsDiv.innerHTML = '<div style="grid-column: 1/-1;"><div class="no-results"><p>No errors found matching your search.</p><p style="font-size: 0.95rem; color: var(--text-light);">Try different keywords or browse all codes.</p></div></div>';
    infoDiv.textContent = "0 results";
    return;
  }

  infoDiv.textContent = `Showing ${errors.length} of ${errorCodes.length} error codes`;

  resultsDiv.innerHTML = errors.map(e => `
    <div class="error-card">
      <div class="error-code">${e.code}</div>
      <div class="error-title">${e.title}</div>
      <div class="error-desc">${e.description}</div>
      <div class="error-solution">
        <strong>Solution:</strong><br>
        ${e.solution}
      </div>
      <div class="error-tags">
        ${e.tags.map(tag => `<span class="error-tag">${tag}</span>`).join("")}
      </div>
    </div>
  `).join("");
}

function filterErrors() {
  const searchTerm = document.getElementById("error-search").value.toLowerCase();
  
  filteredErrors = errorCodes.filter(e => {
    const matchesFilter = activeFilter === "all" || e.category === activeFilter;
    const matchesSearch = !searchTerm || 
      e.code.toLowerCase().includes(searchTerm) ||
      e.title.toLowerCase().includes(searchTerm) ||
      e.description.toLowerCase().includes(searchTerm) ||
      e.tags.some(tag => tag.includes(searchTerm));
    
    return matchesFilter && matchesSearch;
  });

  renderErrors(filteredErrors);
}

// Event listeners
document.getElementById("error-search").addEventListener("input", filterErrors);

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    activeFilter = e.target.dataset.filter;
    filterErrors();
  });
});

// Initial render
renderErrors(errorCodes);
