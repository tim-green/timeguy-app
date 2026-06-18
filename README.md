# Time Guy

This is a free and self-hosted alternative to time.is. It is a live world clock, multi-city board and timezone converter. That got built with Astro + a React island and styled like a chronometer instead of a plain dashboard.

## This is free to run

As there's no paid time API, no geo location service and no backend. So everything is  client side and SSR'd for the initial paint using:

- **`Intl.DateTimeFormat`** 
- **`Intl.DateTimeFormat().resolvedOptions().timeZone`** 
- **`localStorage`**

## Tech Stack

- **Astro**
- **React** — three interactive islands (`client:load`): the live hero clock, the world clock board and the timezone converter
- **TypeScript** — strict mode
- CSS-in-component (scoped `<style>` blocks per React component, global tokens in `src/styles/global.css`)

## Adding more cities

You can add more cities by editing `src/data/cities.ts` and add an entry with a valid IANA timezone identifier (see the [IANA tz database list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)).

Latitude/longitude aren't used for solar calculation today (the day/night strip uses a simple 6am–6pm civic approximation) but are kept in the data model in case you want to swap in real sunrise/sunset math later.

## Local Dev

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs static site to ./dist
npm run preview   # serve the production build locally
```


##### Why the app called Time Guy
Time Guy is a reference from an old comedy/internet podcast episode from Rooster Teeth's [RT Podcast No. 424](https://youtu.be/4MeCTZxumWo?si=-zMrhMquOXur6XCh&t=2126) that I enjoy and still watch.. But there's also a reference calling Time Guy "Father Time".