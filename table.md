# Static Table Structure Integration

This guide defines the canonical approach for adding a static (non-dynamic) table to this project. Follow these steps whenever you create a new static table.

## Columns

- ID
- Name
- Age
- Country
- Actions (Edit, Delete)

## Localization and i18n for static data

All static data added to the project (UI tables, example rows, markdown docs, or other static content) must be integrated with the i18n system. Preferred approaches:

- React components: use useTranslation() and t("namespace.key") for all visible text. Add new keys to client/locales/{en,fr,de,es}.json and keep structure identical across languages.
- Plain HTML / CMS content: avoid hard-coded strings in multiple languages. Provide localized markdown files (docs/locales/<lang>/...) or use data-i18n attributes and add keys to locale JSON files.

Follow these quick examples below for both Option A and Option B.

## Option A — Plain HTML (quick embed)

Use this exact HTML when you need a simple drop-in table (no interactivity required):

```html
<table id="static-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Age</th>
      <th>Country</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>John Doe</td>
      <td>30</td>
      <td>USA</td>
      <td>Edit | Delete</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Jane Smith</td>
      <td>25</td>
      <td>Canada</td>
      <td>Edit | Delete</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Robert Brown</td>
      <td>45</td>
      <td>UK</td>
      <td>Edit | Delete</td>
    </tr>
  </tbody>
</table>
```

## Option B — React component using the project UI library (preferred)

Create a reusable component that follows our design system (Tailwind + components/ui/table and components/ui/button):

Create file: client/components/StaticPersonTable.tsx

```tsx
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const rows = [
  { id: 1, name: "John Doe", age: 30, country: "USA" },
  { id: 2, name: "Jane Smith", age: 25, country: "Canada" },
  { id: 3, name: "Robert Brown", age: 45, country: "UK" },
];

export function StaticPersonTable() {
  return (
    <div className="w-full overflow-hidden rounded-md border">
      <Table className="bg-card">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.age}</TableCell>
              <TableCell>{r.country}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" type="button">
                  Edit
                </Button>
                <Button variant="destructive" size="sm" type="button">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Optional demo page

Create page to preview the table locally.

Create file: client/pages/StaticTableDemo.tsx

```tsx
import React from "react";
import { StaticPersonTable } from "@/components/StaticPersonTable";

export default function StaticTableDemo() {
  return (
    <main className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Static Table Demo</h1>
      <StaticPersonTable />
    </main>
  );
}
```

Register route (add above the catch-all `*` route) in client/App.tsx:

```tsx
// import at top
import StaticTableDemo from "@/pages/StaticTableDemo";

// inside <Routes>
<Route path="/static-table" element={<StaticTableDemo />} />;
```

## Styling notes

- This project’s table styling is provided by components in client/components/ui/table.tsx and Tailwind tokens in client/global.css.
- Keep semantic table markup (<table>, <thead>, <tbody>, <tr>, <th>, <td>).

## Extending the table

- To change columns, update both the header cells and the corresponding body cells.
- For more rows, append to the `rows` array (in Option B) or add more `<tr>` blocks (in Option A).
- If later you need real actions, wire up onClick handlers; for strict static usage, leave buttons as-is.

## Acceptance checklist

- Columns are exactly: ID, Name, Age, Country, Actions.
- Uses either the provided HTML (Option A) or the React component (Option B).
- No external data fetching or state required.
- Route is added only if a demo page is needed.
