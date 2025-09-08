# n8n-nodes-hipe

[![npm version](https://img.shields.io/npm/v/%40packitoo%2Fn8n-nodes-hipe?label=npm%20version)](https://www.npmjs.com/package/@packitoo/n8n-nodes-hipe)
[![CI](https://github.com/packitoo/n8n-nodes-hipe/actions/workflows/ci.yml/badge.svg)](https://github.com/packitoo/n8n-nodes-hipe/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)
[![Node >= 20.15](https://img.shields.io/badge/node-%3E%3D20.15-brightgreen)](#compatibility)

![Packitoo Logo](docs/logo.svg)

Official n8n integration node for [HIPE](https://hipe.packitoo.com) by Packitoo.

Easily connect your n8n workflows to the HIPE SaaS API to automate business processes, manage users, companies, projects, and more.

---

## Table of Contents

- [Module Readiness](#module-readiness)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Examples](#examples)
- [Authentication](#authentication)
- [Compatibility](#compatibility)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

---

## Module Readiness

| Module     | Status     | Notes                       |
| ---------- | ---------- | --------------------------- |
| Users      | ✅ Ready   | Full CRUD                   |
| Companies  | ✅ Ready   | Full CRUD                   |
| Projects   | ✅ Ready   | Full CRUD                   |
| Pipelines  | ✅ Ready   |                             |
| Statuses   | ✅ Ready   |                             |
| Addresses  | ✅ Ready   |                             |
| Imports    | ✅ Ready   |                             |
| Exports    | ✅ Ready   |                             |
| Corrugated | 🟡 Partial | Some submodules in progress |
| Articles   | 🚧 Planned |                             |
| Orders     | 🚧 Planned |                             |
| Quotes     | 🚧 Planned |                             |

<!-- Update this table as modules mature -->

## Installation

### From npm (recommended)

```bash
npm install n8n-nodes-hipe
```

### From GitHub (latest/dev)

```bash
npm install github:packitoo/n8n-nodes-hipe
```

## Getting Started

1. Install the node as above.
2. Restart n8n if running locally.
3. Add the "HIPE" node to your workflow from the n8n node palette.
4. Configure authentication (see below).

## Usage

Basic usage involves adding the HIPE node to your workflow and selecting the desired module and operation. For detailed usage and examples, see the [examples directory](./examples) or the inline documentation in n8n.

> **Tip:** Hover over each parameter in the node UI for helpful descriptions.

### Pagination & Sorting

Companies and Projects List actions use flat pagination and sorting:

- Query params: `page`, `limit`, flat filters (e.g. `status`, `search`)
- Sorting: single `sort` parameter as "field,ASC|DESC"

See the full guide: [docs/pagination.md](./docs/pagination.md)

### Performance & Rate Limits

- Using "Return All" may trigger many requests. Prefer `limit` for large datasets.
- Consider backoff/retry in your workflows if your HIPE instance enforces rate limits.

## Examples

The `examples/` directory contains ready-to-import workflows for common use-cases.

- `examples/manage_companies.json` — Create/update companies from a file.
- `examples/manage_contacts.json` — Manage contacts.
- `examples/manage_projects.json` — Manage projects.
- `examples/export_flat_file.json` — Export flat file from HIPE.
- `examples/import_flat_file.json` — Import flat file to HIPE.

## Authentication

To use this node, you need an API token from HIPE.

- Follow the guide here: [Create Access Token](https://developers.packitoo.com/guides/create-access-token/)
- Enter your token in the HIPE credentials section when configuring the node in n8n.

You can click the "Test" button in the HIPE credentials to validate your token and base URL. The test performs a safe GET request to verify access.

## Compatibility

- Node.js: >= 20.15 (CI runs Node 20)
- n8n Nodes API: v1 (`n8n.n8nNodesApiVersion: 1`)

If you encounter any compatibility issues, please open an issue with details about your environment.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

- Open issues for bugs or feature requests
- Submit pull requests for improvements

## Support

- For common issues and questions, please use [GitHub Issues](https://github.com/packitoo/n8n-nodes-hipe/issues).
- For integration help or custom pipeline requests, please contact your assigned Customer Success Manager.

## License

MIT © [Packitoo](https://packitoo.com)

---

<!-- TODO: Add links to documentation, and other resources as needed -->
