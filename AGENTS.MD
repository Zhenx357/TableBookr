# AGENTS.md

## Project
Build a restaurant booking platform MVP.

This repository is for a booking platform that starts with one restaurant, but the codebase should be structured so more restaurants can be added later.

## Tech stack
- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: NestJS + TypeScript
- Database: PostgreSQL
- ORM: Prisma

## Source of truth
Use `docs/blueprint.md` as the main product and architecture reference.

If there is any conflict between implementation convenience and the blueprint, follow the blueprint unless the task explicitly says otherwise.

## Current scope
Only work on **Phase 1**.

### Phase 1 includes
- database schema
- Prisma models and migrations
- backend restaurant/settings module
- availability logic
- public booking API
- public booking page

### Phase 1 does NOT include
- admin dashboard
- admin auth
- accept/reject admin flows
- manual admin booking creation
- opening hours admin UI
- closed dates admin UI
- email sending
- reminders
- cancellation flow
- auto-complete jobs
- POS integration
- table assignment
- multi-restaurant admin UI
- payments

## Architecture rules
- Build for one restaurant first, but keep the data model multi-restaurant-ready
- Use `restaurant_id` where relevant
- Keep the backend modular
- Do not introduce microservices
- Do not add unnecessary abstractions for future features outside Phase 1

## Booking rules for Phase 1
- Booking slots are 30-minute intervals
- Booking duration is fixed at 2 hours
- Max online booking size is 16 guests
- Minimum lead time is 1 hour
- Opening hours determine valid booking start times
- Closed dates must block booking
- Capacity is checked across all affected overlapping slots
- If all affected slots stay at 0–99 guests, slot status is `available`
- If any affected slot becomes 100–120 guests, slot status is `pending`
- If any affected slot becomes above 120 guests, slot status is `blocked`

## Public API expectations
Implement only the public Phase 1 flow:
- fetch restaurant public booking settings
- fetch availability for a date and guest count
- create booking

Do not implement cancellation, reminders, or admin APIs yet unless explicitly asked.

## Frontend expectations
Implement only the public booking experience for Phase 1:
- guest count selection
- date picker
- available time slots
- name/email/phone form
- submit booking
- result state for confirmed / pending / blocked

## Coding expectations
- Prefer simple, readable code over premature optimization
- Reuse shared types where practical
- Keep validation strict
- Add clear comments only where logic is non-obvious
- Avoid adding features not requested in Phase 1

## Delivery expectations
When implementing:
1. define or update the Prisma schema first
2. implement backend booking/availability logic
3. expose public API routes
4. build the public booking page
5. keep changes small and consistent with the blueprint
