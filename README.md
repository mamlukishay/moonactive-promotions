## Promotions page assignment - Ishay Mamluk

### Installation

Both server and client:

```
npm install
npm start
```

- No need for a local db. Using Mongo on Atlas
- ENV vars are in a .env file (`server/.env`) - File is in git for the assignment although shouldn't be in a production system

<br>

### Usage

- Visit http://localhost:3000
- On the first time no data will be shown. In order to generate 10K fake promotions, click on 'Start Over' (Can do that at any time)

<br>

### Assumptions

#### 1

Since I was working on this mainly on the weekend, I was missing some information.
Mainly I didn't know how should I "break" the data to chunks (for endless scrolling) in terms of the key being used for sorting and paging.
<br>
I thought that using \_id was a bad idea since it would be hard to see the results in the table (mainly for duplicate).

---

So, assumptions are

- `"Start Date"` is a required `Date` field for all promotions.
- Promotions in the table are sorted by `"Start Date"` from the newest to the oldest.

---

#### 2

Agreed with Kobi that all fields are simple text fields

<br>

### Implementation reasonings -

#### Scrolling

- I tried to make the scrolling experience as seemless as I could
- Promotions are loaded in bulks. Bulk size is defined at `src/config.ts`
- A first bulk is loaded when the page loads
- Immediately after this bulk is in (and presented in the table), the next batch is fetched and stored as cache in-memory (as a state entry)
- When the user scrolls to the bottom:
  - The cached bulk is presented
  - Another fetch is being made to bring the next bulk
- So essentially we're always trying to be 1 bulk ahead of the user

#### Small DOM load

- I'm using a table from the `window-table` package which is based on `react-window` [react-windowreact-window.now.sh]
- `react-window` takes care of loading only the viewable rows of the table to the DOM and capable of rendering much more than the requested 10K rows
