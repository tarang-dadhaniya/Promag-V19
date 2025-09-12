# Promag Data Tables

This document defines a practical, production-ready relational schema for the app. It matches the current UI (collections, publications, i18n) and is suitable for Postgres (incl. Neon). Use or adapt as needed.

## Entity overview

- collections: Groups publications
- publications: A publication belongs to one collection
- publication_translations: Localized text fields per publication and locale
- enums: publication_status_enum, orientation_enum

```mermaid
flowchart LR
  C[collections] -->|1..N| P[publications]
  P -->|1..N| PT[publication_translations]
```

## Tables

### 1) collections

| Column       | Type        | Constraints                          | Notes                              |
|--------------|-------------|--------------------------------------|------------------------------------|
| id           | uuid        | PK, default gen_random_uuid()        |                                     |
| title        | text        | NOT NULL                             | Display name                        |
| cover_image  | text        |                                      | Public URL or path                  |
| created_at   | timestamptz | NOT NULL DEFAULT now()               |                                     |
| updated_at   | timestamptz | NOT NULL DEFAULT now()               | Use trigger to keep updated         |

Indexes: (title) for quick search.

### 2) publications

| Column                 | Type                  | Constraints                                    | Notes                                      |
|------------------------|-----------------------|------------------------------------------------|--------------------------------------------|
| id                     | uuid                  | PK, default gen_random_uuid()                  |                                            |
| collection_id          | uuid                  | NOT NULL REFERENCES collections(id) ON DELETE CASCADE | Parent collection                  |
| title                  | text                  | NOT NULL                                       | Canonical (fallback) title                 |
| cover_image            | text                  |                                                | Public URL or path                          |
| status                 | publication_status_enum | NOT NULL DEFAULT 'draft'                     | draft, published, pending                  |
| category               | text                  |                                                | E.g. Marketing, Education                   |
| edition                | text                  |                                                |                                            |
| teaser                 | text                  |                                                | Short summary                              |
| description            | text                  |                                                | Long description                           |
| author                 | text                  |                                                | "Surname1/Surname2/..."                    |
| editor                 | text                  |                                                |                                            |
| language               | text                  | CHECK (char_length(language) IN (2,5))         | IETF/ISO code (e.g. 'en', 'de-DE')         |
| release_date           | date                  |                                                |                                            |
| isbn_issn              | text                  |                                                |                                            |
| index_offset           | integer               | NOT NULL DEFAULT 0                             |                                            |
| document_print_allowed | boolean               | NOT NULL DEFAULT false                         |                                            |
| preview_pages          | integer               |                                                | Number of pages visible in preview         |
| orientation            | orientation_enum      |                                                | portrait, landscape                        |
| presentation           | boolean               | NOT NULL DEFAULT false                         |                                            |
| created_at             | timestamptz           | NOT NULL DEFAULT now()                         |                                            |
| updated_at             | timestamptz           | NOT NULL DEFAULT now()                         |                                            |

Indexes:
- (collection_id)
- (status)
- (title gin_trgm_ops) for fuzzy search (requires pg_trgm)

### 3) publication_translations

Localized copies of user-facing text for each locale.

| Column        | Type        | Constraints                                         | Notes                              |
|---------------|-------------|-----------------------------------------------------|------------------------------------|
| id            | uuid        | PK, default gen_random_uuid()                       |                                    |
| publication_id| uuid        | NOT NULL REFERENCES publications(id) ON DELETE CASCADE | Parent                         |
| locale        | text        | NOT NULL                                            | e.g. 'en', 'de', 'es', 'fr'       |
| title         | text        |                                                     | Localized title                    |
| teaser        | text        |                                                     | Localized teaser                   |
| description   | text        |                                                     | Localized description              |
| created_at    | timestamptz | NOT NULL DEFAULT now()                              |                                    |
| updated_at    | timestamptz | NOT NULL DEFAULT now()                              |                                    |

Constraints:
- UNIQUE (publication_id, locale)

## SQL DDL

```sql
-- Enums
CREATE TYPE publication_status_enum AS ENUM ('draft', 'published', 'pending');
CREATE TYPE orientation_enum AS ENUM ('portrait', 'landscape');

-- collections
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  cover_image text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_collections_title ON collections (title);

-- publications
CREATE TABLE IF NOT EXISTS publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  title text NOT NULL,
  cover_image text,
  status publication_status_enum NOT NULL DEFAULT 'draft',
  category text,
  edition text,
  teaser text,
  description text,
  author text,
  editor text,
  language text CHECK (char_length(language) IN (2,5)),
  release_date date,
  isbn_issn text,
  index_offset integer NOT NULL DEFAULT 0,
  document_print_allowed boolean NOT NULL DEFAULT false,
  preview_pages integer,
  orientation orientation_enum,
  presentation boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_publications_collection_id ON publications (collection_id);
CREATE INDEX IF NOT EXISTS idx_publications_status ON publications (status);
-- Optional fuzzy search
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX IF NOT EXISTS idx_publications_title_trgm ON publications USING gin (title gin_trgm_ops);

-- translations
CREATE TABLE IF NOT EXISTS publication_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id uuid NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
  locale text NOT NULL,
  title text,
  teaser text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (publication_id, locale)
);
```

## Example data (seed)

```sql
-- 1) Create a collection
INSERT INTO collections (id, title, cover_image)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Publications',
  'https://example.com/images/collections/publications.jpg'
);

-- 2) Create a publication (canonical fields in English as fallback)
INSERT INTO publications (
  id, collection_id, title, cover_image, status, category, teaser, description,
  author, language, release_date, isbn_issn, preview_pages, orientation, presentation
) VALUES (
  '10000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Technical Analysis of the Financial Markets',
  'https://example.com/images/publications/financial-marketing.jpg',
  'published',
  'Marketing',
  'Insights into impactful campaigns and digital tools.',
  'Discover the art and science of financial marketing in this comprehensive guide tailored for professionals in the finance industry. Mastering Financial Marketing offers actionable insights into crafting impactful campaigns, leveraging digital tools, and staying compliant with industry regulations.',
  'Hirschi/Trepp/Zulliger',
  'de',
  '2024-10-08',
  '978-3-16-148410-0',
  30,
  'portrait',
  false
);

-- 3) Localizations (German shown as primary, plus English fallback)
INSERT INTO publication_translations (publication_id, locale, title, teaser, description)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'de',
   'Technische Analyse der Finanzmärkte',
   'Einblicke in wirkungsvolle Kampagnen und digitale Tools.',
   'Entdecken Sie die Kunst und Wissenschaft des Finanzmarketings in diesem umfassenden Leitfaden für Fachkräfte der Finanzbranche. Das Beherrschen des Finanzmarketings bietet umsetzbare Einblicke in die Erstellung wirkungsvoller Kampagnen, die Nutzung digitaler Tools und die Einhaltung von Branchenvorschriften.'),
  ('10000000-0000-0000-0000-000000000001', 'en',
   'Technical Analysis of the Financial Markets',
   'Insights into impactful campaigns and digital tools.',
   'Discover the art and science of financial marketing in this comprehensive guide tailored for professionals in the finance industry. Mastering Financial Marketing offers actionable insights into crafting impactful campaigns, leveraging digital tools, and staying compliant with industry regulations.');
```

## Example query: fetch by locale with fallback

```sql
-- :locale is the desired language code (e.g., 'de')
SELECT
  p.id,
  p.collection_id,
  COALESCE(pt.title, p.title)              AS title,
  COALESCE(pt.teaser, p.teaser)            AS teaser,
  COALESCE(pt.description, p.description)  AS description,
  p.cover_image,
  p.status,
  p.category,
  p.author,
  p.language,
  p.release_date,
  p.preview_pages
FROM publications p
LEFT JOIN publication_translations pt
  ON pt.publication_id = p.id AND pt.locale = $1
WHERE p.collection_id = $2
ORDER BY p.created_at DESC;
```

## JSON shape (mirrors app types)

```json
{
  "id": "10000000-0000-0000-0000-000000000001",
  "collectionId": "00000000-0000-0000-0000-000000000001",
  "title": "Technical Analysis of the Financial Markets",
  "coverImage": "https://example.com/images/publications/financial-marketing.jpg",
  "status": "published",
  "category": "Marketing",
  "teaser": "Insights into impactful campaigns and digital tools.",
  "description": "Discover the art and science of financial marketing in this comprehensive guide...",
  "author": "Hirschi/Trepp/Zulliger",
  "language": "de",
  "releaseDate": "2024-10-08",
  "isbnIssn": "978-3-16-148410-0",
  "indexOffset": 0,
  "documentPrintAllowed": false,
  "previewPages": 30,
  "orientation": "portrait",
  "presentation": false
}
```

## Notes
- All dates are UTC; use timestamptz.
- Keep i18n text out of the base table when it needs per-locale variants; use publication_translations.
- Enforce updated_at via trigger if available.
- Works well with MCP backends like Neon + Prisma. If you plan to connect a DB, you can Connect to Neon via the MCP popover and generate this schema.
