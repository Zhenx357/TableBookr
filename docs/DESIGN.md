# Public Booking Flow Design

## Direction

The public booking flow should feel calm, elegant, and hospitality-oriented. It should read like a restaurant reservation experience, not a checkout funnel and not a dashboard. The interface should stay minimal, with generous spacing, clear hierarchy, and a restrained palette led by deep green, warm neutrals, and soft borders.

The overall mood to preserve from the Stitch booking flow:

- simple and uncluttered
- polished but understated
- service-oriented rather than transactional
- readable on first glance
- focused on one primary action at a time

## Branding And Header Style

The header should be light, quiet, and minimal.

- Use a slim white header bar with a subtle bottom border and a very soft shadow.
- Keep branding text-based rather than logo-heavy.
- Brand treatment should feel restaurant-like: small uppercase or refined wordmark styling, slightly increased letter spacing, and deep green text.
- Avoid dense navigation, utility menus, account controls, or dashboard chrome.
- A single low-emphasis helper action is acceptable, but the header should not compete with the booking flow.

## Page Width And Layout

The page should sit inside a centered container with generous side padding.

- Max outer container width: around `1280px`.
- The booking content itself should feel narrower than a full application shell.
- Use one centered main card for step 1 and step 2.
- On larger screens, allow the content to breathe horizontally, but keep the booking form visually focused in the center of the page.
- On mobile, collapse into a single-column flow with consistent vertical spacing.

Use a soft page background and a white main surface card:

- page background: very light neutral surface
- main card: white or near-white
- border: light outline
- shadow: subtle, never heavy or floating like a dashboard widget

## 2-Step Flow Structure

The public flow should be treated as two deliberate booking steps.

### Step 1: Booking Details

Show:

- restaurant name
- guest selector
- date selection
- time slot selection

This step should feel like choosing a moment, not filling out a form. The time slot area should become the visual focus once guest count and date are selected.

### Step 2: Contact Details

Show:

- compact summary of selected booking details
- name
- email
- phone
- primary submit action

This step should feel confirming and personal. The summary should reassure the guest that they chose the right date, time, and party size before they submit.

## Typography Hierarchy

Typography should stay clean and modern, with a restrained sans-serif system matching the Stitch project.

- Primary family: `Inter`
- Tone: clean, neutral, contemporary, not editorial and not corporate-heavy

Recommended hierarchy:

- Page title / step title: medium-large, semibold, centered or visually prominent
- Section labels: small-medium, semibold
- Body copy: regular weight, high readability
- Supporting copy: smaller size with softer contrast
- Button labels: medium weight
- Summary metadata / helper text: small, muted

Typography rules:

- Keep line lengths moderate.
- Avoid oversized display text.
- Avoid bold everywhere; reserve emphasis for titles, active steps, and primary actions.
- Use muted secondary text for explanations such as pending confirmation guidance.

## Spacing System

Use an 8px rhythm throughout, matching the Stitch spacing foundation.

- Base unit: `8px`
- Tight stack: `8px`
- Standard stack: `16px`
- Large stack: `24px`
- Section stack: `32px`

Guidelines:

- Inputs, buttons, and selectors should feel comfortably padded rather than compact.
- Step content should be divided into clear sections with consistent vertical rhythm.
- Use generous spacing around the time slot grid so the flow never feels compressed.
- Mobile spacing should remain airy; do not collapse the design into dense rows.

## Color Usage

The palette should stay minimal and hospitality-led.

Core colors taken from the Stitch project direction:

- Primary dark green: `#012d1d`
- Supporting green: `#1b4332`
- Page background: `#f9f9fc`
- White surface: `#ffffff`
- Main text: `#1a1c1e`
- Secondary text: `#414844`
- Border / outline: `#c1c8c2`
- Stronger outline: `#717973`
- Error: `#ba1a1a`
- Soft error background: `#ffdad6`

Usage principles:

- Green is the anchor color for brand, active step states, primary actions, and confirmed cues.
- Most of the UI should remain neutral, with color used intentionally rather than everywhere.
- Pending states should be visually distinct from available states without turning the page into a warning-heavy interface.
- Blocked states should look unavailable and quiet, not aggressive.

## Button Styles

### Primary Button

Used for:

- Continue
- Confirm booking

Style:

- solid deep green background
- white text
- modest corner radius
- soft shadow
- comfortable height
- clear hover and focus states

Tone:

- confident and polished
- not loud or oversized

### Secondary Button

Used for:

- Back
- Cancel

Style:

- white or near-white background
- green or dark neutral text
- light border
- subtle hover state

Secondary actions should never compete with the primary action.

## Input Styles

Form fields should be simple, refined, and highly legible.

- White background
- Light border using the outline color
- Medium corner radius
- Comfortable horizontal padding
- Consistent field height
- Label above field
- Focus state: primary green border with a subtle focus ring

Inputs should feel polished but quiet. Avoid strong fills, inset effects, or heavy shadows.

Validation presentation:

- Keep client-side validation simple and inline.
- Error text should be short and calm.
- Use error color sparingly and only where needed.

## Guest Selector Styles

The guest selector should feel like a refined form control, not a quantity counter from ecommerce.

- Use a single clean control with border, subtle iconography, and a chevron or clear affordance.
- Keep the value readable and centered on the choice itself.
- Use the same surface, border, radius, and focus treatment as other fields.
- Do not style it like a stepper with plus/minus unless a later redesign explicitly wants that.

## Date Picker Pattern

The date selection pattern should support both speed and clarity.

### Quick Date Chips

Preferred first interaction:

- show a short row or wrap of date chips for near-term options such as today, tomorrow, and the next few days
- each chip should be pill-shaped or softly rounded
- selected chip should use the primary color or a pale primary tint with strong text contrast
- unselected chips should stay neutral with a light border

These chips make the experience feel like choosing a reservation moment rather than opening a tool-heavy date UI.

### Calendar Fallback

Also provide a standard calendar input or calendar picker for dates outside the quick choices.

- Keep the calendar trigger visually aligned with the other form controls.
- Prefer a simple, unobtrusive calendar interaction.
- Do not turn the calendar into a large booking widget or travel-style search module.

## Time Slot Styles And States

Time slots should be displayed as clear selectable buttons in a tidy grid. They are one of the main emotional touchpoints of the flow, so readability and state clarity matter more than visual complexity.

- Use a clean multi-column grid on desktop.
- Collapse gracefully on smaller screens.
- Each slot should look like a button with consistent height, border, and radius.

### Instant / Available

This maps to the API `available` state.

Style:

- white or near-white surface
- light border
- dark text
- on selection, use a pale green tint with a primary border and primary text

Meaning:

- immediate booking path
- should feel open and easy

### Request / Pending

This maps to the API `pending` state.

Style:

- selectable
- clearly distinct from available
- use a soft tinted background or outlined treatment that reads as cautionary but still calm
- include a short nearby explanation such as requiring restaurant confirmation

Meaning:

- the guest can continue
- the request is valid, but not instantly confirmed

Pending should feel acceptable and understandable, not like an error state.

### Unavailable / Blocked

This maps to the API `blocked` state.

Style:

- visible but disabled
- muted text
- low-contrast border or surface
- no hover affordance

Meaning:

- unavailable for selection

Blocked slots should remain readable so the guest understands the range of times, but they should not invite interaction.

## Stepper Styles

The stepper should be present but understated.

- Use a horizontal stepper at the top of the booking card.
- Active step: filled primary circle with white text.
- Completed step: a completed state can use a checkmark or subtle completed indicator.
- Inactive step: neutral surface with outline border.
- Connecting lines should be light and unobtrusive.

The stepper should orient the guest without making the flow feel procedural or enterprise-like.

## Summary Style For Step 2

The booking summary on the contact step should be compact, calm, and reassuring.

- Use a muted surface card inside the main white card.
- Include the chosen date, time, and guest count.
- Use small icons only if they improve scanning; keep them restrained.
- Use a simple grid or inline metadata layout depending on screen width.
- Keep the summary visually distinct from the editable form fields.

The summary should feel like a reservation recap, not an order summary. Avoid totals, pricing language, breakdown rows, or any checkout cues.

## Result State Style After Submit

After submission, the result state should shift from form entry into clear reassurance.

- Use a narrower centered confirmation card.
- Keep the same white surface, soft border, and generous padding.
- Show a simple icon badge at the top.
- Follow with a concise result heading and a short explanatory paragraph.
- Include a compact reservation details recap below.

### Confirmed

- Use a positive hospitality tone.
- Confirmation styling can lean on primary green and a soft green-tinted icon badge.

### Pending

- Use calm explanatory copy that the restaurant needs to confirm the request.
- Visually distinct from confirmed, but still reassuring and valid.

### Blocked

- Keep the tone polite and clear.
- Avoid alarming error treatment.
- Make it obvious the booking was not created.

## Tone And Interaction Principles

The booking flow should feel like guest service, not system operation.

- Prefer calm, concise wording.
- Avoid urgent commerce language such as checkout, pay now, totals, cart, or purchase.
- Avoid dashboard patterns like sidebars, dense panels, analytics cards, status tables, or app-like chrome.
- Keep each step focused on a single decision.
- Make state differences clear without adding visual noise.
- Use whitespace to create confidence.
- Keep the interaction lightweight, especially on mobile.

If a design choice feels more like SaaS tooling or ecommerce checkout than restaurant hospitality, it is the wrong direction for this flow.
