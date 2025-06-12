# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `pnpm dev`
- **Build for production**: `pnpm build`
- **Build for deployment platforms**:
  - Vercel: `pnpm build:vercel`
  - Netlify: `pnpm build:netlify` 
  - Deno Deploy: `pnpm build:deno`
- **Preview production build**: `pnpm start:preview`

## Architecture Overview

This is a Nitro-based REST API proxy for the Korean OSORI (Open Source License Information) service. The architecture follows these patterns:

### API Structure
- **API routes**: Located in `api/` directory using Nitro's file-based routing
- **Schemas**: TypeScript interfaces in `schema/` for request/response validation using Valibot
- **Services**: Business logic in `services/` for external API communication
- **Utils**: Shared utilities in `utils/` for caching, search parsing, and error handling

### Key Components
- **Caching**: Uses Nitro's `cachedFunction` with custom cache options (6-hour cache, 12-hour stale)
- **Search**: Lucene-kit based query parsing for flexible search syntax
- **Error handling**: Centralized error response creation
- **OpenAPI**: Auto-generated documentation at root path using Scalar UI
- **Data transformation**: Utilities in `utils/license-transform.ts` for upstream API inconsistencies

### Data Flow
1. API routes receive requests and validate using schema functions
2. Services make cached calls to upstream OSORI API (olis.or.kr)
3. Responses are transformed from OSORI format to simplified REST format
4. All external calls include retry logic and proper error handling

### External Dependencies
- **Upstream API**: https://www.olis.or.kr:15443/api/v2/
- **Package manager**: pnpm (specified in packageManager field)
- **Runtime**: Node.js with Nitro framework

## Important Notes

### Temporary Data Transformations
The `utils/license-transform.ts` file contains transformation logic for upstream API inconsistencies:

- **nicknamelist conversion**: Currently converts string-formatted nicknamelist to proper arrays
- **Removal instructions**: When upstream API is fixed, these transformations can be safely removed

Example usage:
```typescript
import { transformLicenseDetail } from '~/utils/license-transform'
const transformedData = transformLicenseDetail(upstreamData)
```