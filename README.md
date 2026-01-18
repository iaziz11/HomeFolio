# HomeFolio

HomeFolio is a backend-rendered Node.js application for creating and maintaining “folios” for real-world assets—home appliances, vehicles, tools, and more. Each folio acts as a single place to store reminders, documents, and an expense history for the asset.

There is no separate frontend application. Pages are rendered on the server.

## What you can do with HomeFolio

- **Create asset folios** for anything you own (appliances, vehicles, electronics, equipment, etc.)
- **Add reminders** tied to an asset (maintenance, renewals, inspections, replacement schedules)
- **Attach files** to an asset (manuals, warranties, invoices, photos, documents)
- **Track expenses** per asset over time (parts, service, upgrades, recurring costs)
- **Capture expenses from receipts** by uploading a receipt photo to automatically create an expense entry (review/edit as needed)

## Quick start

### Prerequisites

- Node.js (LTS recommended)
- npm

### Run locally

```bash
git clone https://github.com/iaziz11/HomeFolio.git
cd HomeFolio

# If this is your first run:
npm install

npm run start
```

## How it works (high level)

HomeFolio is intentionally built as a **server-rendered application**. The UI is delivered as HTML generated on the backend, and all core workflows (folios, reminders, uploads, expense logging, and receipt processing) are handled server-side.

Receipt capture works by taking an uploaded receipt image and extracting structured details (such as vendor, date, and total) to automatically create an expense entry. Because receipts vary widely, extracted results may require a quick review or correction.

## Usage overview

A typical workflow looks like this:

1. Create a folio for an asset (e.g., _Kitchen Refrigerator_ or _2017 Honda Civic_).
2. Add key metadata and notes you want to remember later.
3. Upload related documents (warranty PDFs, manuals, service records).
4. Create reminders for recurring or scheduled tasks (filter changes, inspections, renewals).
5. Add expenses manually or upload receipt photos to generate expenses automatically.
6. Review an asset’s full history at any time (documents, reminders, and cost of ownership).

## Data and privacy notes

Receipts and uploaded files can contain sensitive personal information. If you deploy HomeFolio yourself:

- Treat stored files and backups accordingly
- Avoid committing secrets, credentials, or private data to the repository
- Follow best practices for securing uploaded documents

## Roadmap ideas

- Export expenses (CSV)
- More robust receipt parsing with line-item support
- Recurring reminders and notification preferences
- Sharing or multi-user collaboration per folio
