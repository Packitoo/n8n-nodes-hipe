# n8n-nodes-hipe

This package contains a custom n8n node for integrating with the HIPE API from Packitoo. It provides access to Corrugated resources and Projects endpoints.

## Features

This node provides access to the following HIPE API resources:

### Corrugated Resources
- CorrugatedMaterials (Create, Get, List, Update)
- CorrugatedMaterialCompositions (Create, CreateBulk, Get, List, Update, Delete)
- CorrugatedMaterialCompositionPrices (Create, CreateBulk, Get, List, Update, Delete)
- CorrugatedFormats (Create, Get, List, Update)
- CorrugatedSuppliers (Create, List, Update)
- CorrugatedFlutes (Create, Get, List, Update)
- CorrugatedLiners (Create, Get, List, Update)

### Projects Resource
- Projects (Create, Get, List, Update)

## Prerequisites

- [n8n](https://n8n.io/) (version 1.0.0 or later)
- HIPE API access credentials (API URL and Bearer Token)

## Installation

### Local Installation

To use this node locally, you can install it using npm:

```bash
npm install n8n-nodes-hipe
```

### n8n Community Node Installation

For n8n community node installation, follow these steps:

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-hipe` in the input field
4. Click **Install**

Alternatively, you can install it directly using the n8n CLI:

```bash
n8n community-node install n8n-nodes-hipe
```

## Usage

1. Add the HIPE node to your workflow
2. Configure your HIPE API credentials
3. Select the resource and operation you want to perform
4. Configure the operation parameters
5. Connect the node to the rest of your workflow

## Development

If you want to contribute to this node or modify it for your own needs:

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Build the node
npm run build

# Link to your local n8n installation
npm link
cd ~/.n8n/nodes
npm link n8n-nodes-hipe
```

## API Documentation

For more information about the HIPE API, refer to the official API documentation:

[HIPE API Documentation](https://dev-hipe.packitoo.com/doc-json)

## License

[MIT](LICENSE.md)
