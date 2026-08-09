# Mandatory System Guidelines & Rules

All developers and automated agents contributing to **Humanity First Learning Hub** must strictly follow these mandatory operational rules.

---

### 1. Doc-First Protocol
- Before modifying any Express controller, route, Mongoose schema, or React component page:
  1. Consult **[docs/FILE_MAP.md](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/docs/FILE_MAP.md)** to understand component and module dependencies.
  2. Review **[docs/DATA_FLOW_AND_STATE.md](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/docs/DATA_FLOW_AND_STATE.md)** to verify pipeline state variables.
  3. Verify **[docs/API_CONTRACTS.md](file:///c:/Users/shyam%20phad/Documents/Projects/NGO_LMS/docs/API_CONTRACTS.md)** for exact JSON payload expectations.

---

### 2. Mandatory Documentation Synchronization
- Whenever an API endpoint, model schema, or React state property is modified, added, or removed:
  - Update the corresponding documentation file in `/docs` (`FILE_MAP.md`, `DATA_FLOW_AND_STATE.md`, or `API_CONTRACTS.md`) in the **exact same task/commit**.
  - Keep doc references 100% in sync with code logic.

---

### 3. Absolute Zero Mock Policy
- **NO IN-MEMORY FALLBACK ARRAYS**: Never introduce global mock arrays or fallback objects (e.g. `DEMO_PROGRESS`, `DEMO_USERS`, or fallback metric objects).
- All application statistics, learner progress records, quiz scores, certificate statuses, and user directory entries must be computed directly from MongoDB via clean Mongoose queries and REST APIs.

---

### 4. ObjectId Normalization Rule
- Always convert Mongoose `ObjectId` references to string representation using `String(id)` or `id.toString()` before performing comparisons in both backend controllers and React frontend components.
- Never use strict reference equality (`===`) between an `ObjectId` and a string `id`.
