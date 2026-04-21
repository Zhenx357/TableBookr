# Booking Platform Phase 1 Blueprint

## Project Goal
Build the first version of a restaurant booking platform.

This version is for **one restaurant**, but the codebase and data model should be structured so more restaurants can be added later.

Phase 1 only covers the **public booking flow** and the backend logic required to support it.

---

## Phase 1 Scope

### Included
- database schema
- Prisma models and migration
- seed data for one restaurant
- public restaurant booking settings
- opening hours
- closed dates
- availability calculation
- booking creation
- public booking page
- result state after booking creation

### Not Included
- admin dashboard
- admin login
- manual admin booking creation
- accept/reject admin UI
- email sending
- reminders
- cancellation flow
- auto-complete jobs
- table assignment
- table layout / floor plan
- POS integration
- payments
- duplicate booking protection

---

## Core Business Rules

### Booking Slots
- booking times are shown in **30-minute intervals**
- each booking has a fixed duration of **2 hours**
- a booking affects the selected start slot and all overlapping 30-minute slots within that duration

### Guest Limits
- maximum online booking size is **16 guests**
- if guest count is above 16, the booking should not be allowed online
- user should instead be told to contact the restaurant

### Lead Time
- online bookings must be made at least **1 hour before** the booking time

### Opening Hours
- booking start times are only available within configured opening hours
- a booking may continue past closing time if its start time was valid

### Closed Dates
- some dates can be marked as closed for booking
- no online bookings are allowed on closed dates

### Capacity Logic
Each 30-minute slot has a hard capacity limit of **120 guests**.

When checking a requested booking, calculate all affected overlapping slots for the 2-hour duration.

Booking outcome rules:
- if all affected slots stay within **0–99 guests**, the booking is **confirmed**
- if any affected slot becomes **100–120 guests**, the booking is **pending**
- if any affected slot becomes **above 120 guests**, the booking is **blocked**

### Pending Logic
- pending means the booking request was accepted by the system but is **not confirmed**
- Phase 1 only needs to return status correctly
- no admin handling is needed yet in Phase 1

---

## Public Booking Flow

1. User opens the booking page for a restaurant
2. User selects number of guests
3. User selects a date
4. System returns available booking times for that date and guest count
5. User selects a time
6. User enters:
   - name
   - email
   - phone
7. User submits the booking
8. System creates the booking and returns one of these statuses:
   - `confirmed`
   - `pending`
   - `blocked`

---

## Required Fields
The following fields are required for booking:
- name
- email
- phone
- guest count
- date
- time

---

## Data Model

### restaurants
Represents a restaurant.

Suggested fields:
- id
- name
- slug
- email
- phone
- created_at
- updated_at

### restaurant_settings
Stores booking rules and configuration for a restaurant.

Suggested fields:
- id
- restaurant_id
- booking_slot_minutes
- booking_duration_minutes
- max_online_party_size
- auto_confirm_threshold
- hard_capacity_limit
- minimum_lead_time_minutes
- created_at
- updated_at

Suggested defaults:
- booking_slot_minutes = 30
- booking_duration_minutes = 120
- max_online_party_size = 16
- auto_confirm_threshold = 99
- hard_capacity_limit = 120
- minimum_lead_time_minutes = 60

### opening_hours
Stores weekly opening hours.

Suggested fields:
- id
- restaurant_id
- weekday
- is_open
- open_time
- close_time
- created_at
- updated_at

### closed_dates
Stores dates where the restaurant is closed for booking.

Suggested fields:
- id
- restaurant_id
- date
- note
- created_at

### bookings
Stores customer bookings.

Suggested fields:
- id
- restaurant_id
- customer_name
- customer_email
- customer_phone
- guest_count
- booking_date
- booking_start_time
- booking_end_time
- status
- source
- created_at
- updated_at

Suggested values for `status`:
- confirmed
- pending
- blocked

Suggested values for `source`:
- website

Note:
Phase 1 does not need cancellation fields, reminder fields, or admin-related fields yet.

---

## Public API Requirements

### 1. Get public restaurant booking settings
`GET /public/restaurants/:slug`

Returns public restaurant information needed by the booking page.

Response should include at least:
- restaurant name
- slug
- max online party size
- slot interval
- booking duration

### 2. Get availability
`POST /public/restaurants/:slug/availability`

Request body:
```json
{
  "date": "2026-05-10",
  "guestCount": 4
}
```

Response example:
```json
{
  "slots": [
    { "time": "18:00", "status": "available" },
    { "time": "18:30", "status": "pending" },
    { "time": "19:00", "status": "blocked" }
  ]
}
```

Slot statuses:
- `available`
- `pending`
- `blocked`

Meaning:
- `available` => booking would be confirmed
- `pending` => booking would be created as pending
- `blocked` => booking cannot be created

### 3. Create booking
`POST /public/restaurants/:slug/bookings`

Request body:
```json
{
  "guestCount": 4,
  "date": "2026-05-10",
  "time": "18:30",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+4512345678"
}
```

Response example:
```json
{
  "bookingId": "uuid",
  "status": "confirmed"
}
```

Possible statuses:
- `confirmed`
- `pending`
- `blocked`

If blocked, booking should not be created.

---

## Availability Logic

When availability is requested:

1. validate restaurant exists
2. validate guest count is within online limit
3. validate date is not closed
4. find matching opening hours for the selected day
5. if restaurant is closed, return no slots
6. generate booking start times in 30-minute intervals during opening hours
7. remove times that violate minimum lead time
8. for each slot:
   - calculate booking end time using 2-hour duration
   - determine all overlapping 30-minute slots
   - find existing bookings affecting those slots
   - sum guest counts
   - add requested guest count
   - decide slot status:
     - above 120 in any affected slot => `blocked`
     - 100–120 in any affected slot => `pending`
     - otherwise => `available`

Important:
- only bookings with active statuses should count toward capacity
- blocked requests should not be stored as bookings

---

## Booking Creation Logic

When creating a booking:

1. validate restaurant exists
2. validate required fields
3. validate guest count is between 1 and 16
4. validate booking date is not closed
5. validate booking start is within opening hours
6. validate minimum lead time
7. calculate affected overlapping slots
8. calculate resulting capacity totals
9. determine status:
   - `confirmed`
   - `pending`
   - `blocked`
10. if status is `blocked`, return blocked response and do not create booking
11. if status is `confirmed` or `pending`, create booking record
12. return booking id and status

---

## Validation Rules

### Availability request validation
- restaurant must exist
- date required
- guestCount required
- guestCount must be between 1 and 16

### Booking creation validation
- restaurant must exist
- name required
- email required
- phone required
- date required
- time required
- guestCount required
- guestCount must be between 1 and 16
- booking must meet minimum lead time
- booking must be on an open date
- booking time must be within opening hours

---

## Public Page Requirements

### Booking Page
Route example:
`/book/[restaurantSlug]`

Page should include:
- restaurant name
- guest count selector
- date picker
- available time slots
- name input
- email input
- phone input
- submit button

Expected behavior:
- user selects guest count and date first
- frontend fetches available slots
- user chooses a slot
- user enters customer info
- submit creates booking
- result state is shown after submission

### Result States
After booking submission, show one of:
- confirmed
- pending
- blocked / unavailable

Suggested messaging:
- confirmed: "Your booking is confirmed."
- pending: "Your booking request has been received and is awaiting confirmation from the restaurant."
- blocked: "This time is not available online. Please choose another time or contact the restaurant."

---

## Suggested Project Structure

### Frontend
```txt
apps/web/
  app/
    book/
      [restaurantSlug]/
        page.tsx
  components/
    booking/
    ui/
  lib/
    api/
    utils/
```

### Backend
```txt
apps/api/
  src/
    modules/
      restaurants/
      settings/
      availability/
      bookings/
    prisma/
    common/
```

---

## Build Order

### Step 1
Create Prisma schema for:
- restaurants
- restaurant_settings
- opening_hours
- closed_dates
- bookings

### Step 2
Create initial migration

### Step 3
Create seed data for one restaurant with:
- restaurant row
- restaurant settings
- opening hours
- optional closed date example

### Step 4
Implement availability calculation service

### Step 5
Implement public API endpoints:
- GET /public/restaurants/:slug
- POST /public/restaurants/:slug/availability
- POST /public/restaurants/:slug/bookings

### Step 6
Implement public booking page in Next.js

### Step 7
Test the main cases:
- confirmed booking
- pending booking
- blocked booking
- closed date
- over 16 guests
- less than 1 hour lead time
- booking within opening hours
- booking that extends past closing time

---

## Out of Scope for Phase 1
Do not implement:
- admin dashboard
- admin auth
- manual admin booking creation
- email sending
- reminders
- cancellation
- status history
- background jobs
- table assignment
- floor plan
- SMS
- POS integration
- payments
- multi-restaurant admin interface

---

## Summary
Phase 1 should deliver:
- a working public booking page
- slot-based availability
- booking creation
- correct confirmed/pending/blocked behavior
- a clean backend and data model that can support later phases