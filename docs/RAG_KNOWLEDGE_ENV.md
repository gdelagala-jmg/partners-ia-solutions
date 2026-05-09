# RAG Knowledge Layer — Environment Variables

## Required for Knowledge System

```env
# Neon PostgreSQL connection (pgvector vector store)
# Get this from: Neon Console → Project → Connection Details
NEON_DATABASE_URL="postgresql://user:pass@host/neondb?sslmode=require"

# Google Gemini API Key (for embeddings + chat)
# Already exists in Vercel production env
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"

# Admin API protection (already exists)
CRON_SECRET="your-cron-secret"
```

## API Endpoints

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/admin/knowledge/ingest` | POST | CRON_SECRET | Index content into vector store |
| `/api/admin/knowledge/ingest` | GET | CRON_SECRET | Get index stats |
| `/api/admin/knowledge/search` | GET | CRON_SECRET | Semantic search (debug) |
| `/api/assistant/chat-rag` | POST | Public | RAG-enhanced chat (test) |
| `/api/assistant/chat` | POST | Public | Original chat (production) |

## Ingestion API Usage

```bash
# Full re-index
curl -X POST "https://your-domain.com/api/admin/knowledge/ingest?secret=YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"scope": "all"}'

# Index only solutions
curl -X POST "https://your-domain.com/api/admin/knowledge/ingest?secret=YOUR_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"scope": "solutions"}'

# Get stats
curl "https://your-domain.com/api/admin/knowledge/ingest?secret=YOUR_CRON_SECRET"
```

## Search API Usage

```bash
# Basic search
curl "https://your-domain.com/api/admin/knowledge/search?secret=YOUR_CRON_SECRET&q=SaveFuel"

# Filtered search
curl "https://your-domain.com/api/admin/knowledge/search?secret=YOUR_CRON_SECRET&q=IA+empresas&contentType=solution&topK=3"
```

## Security Notes

- NEVER log actual env values
- All admin/knowledge endpoints require CRON_SECRET
- The chat-rag endpoint is public (same as original chat)
- Neon credentials should be added to Vercel env vars for production
