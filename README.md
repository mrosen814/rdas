# We Have Food at Home

A simple family dinner tracker for the Rosens. Keeps track of meals you've made, meals you want to try, family ratings, and notes.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data

Dinners are stored in `data/dinners.json`. The app reads and writes this file directly — no database setup needed. Back it up occasionally if you care about not losing your list.

## Features

- Add, edit, and delete dinners
- Filter by status: Want to Try / Made Before / Family Favourite / Not Again
- Search by name or tag
- Track recipe links, family ratings (1–5), notes, tags, and date last made

## Status options

| Status | Meaning |
|---|---|
| Want to Try | On the list |
| Made Before | Tried it |
| Family Favourite | A keeper |
| Not Again | Never again |

## Rating scale

| Rating | Meaning |
|---|---|
| 5 | Loved it |
| 4 | Liked it |
| 3 | It was ok |
| 2 | Didn't love it |
| 1 | Would not eat again |
