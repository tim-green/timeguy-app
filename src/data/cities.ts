// All timezone math runs on the IANA Time Zone Database, accessed via Intl.DateTimeFormat. This file has helper functions for that.

export interface City {
  id: string;
  city: string;
  country: string;
  tz: string; // IANA timezone identifier
  lat: number;
  lon: number;
}

export const CITIES: City[] = [
  { id: "sf", city:  "San Francisco", country: "USA", tz: "America/Los_Angeles", lat: 37.77, lon: -122.42 },
  { id: "nyc", city: "New York", country: "USA", tz: "America/New_York", lat: 40.71, lon: -74.01 },
  { id: "mex", city: "Mexico City", country: "Mexico", tz: "America/Mexico_City", lat: 19.43, lon: -99.13 },
  { id: "sao", city: "São Paulo", country: "Brazil", tz: "America/Sao_Paulo", lat: -23.55, lon: -46.63 },
  { id: "lon", city: "London", country: "UK", tz: "Europe/London", lat: 51.51, lon: -0.13 },
  { id: "par", city: "Paris", country: "France", tz: "Europe/Paris", lat: 48.85, lon: 2.35 },
  { id: "ber", city: "Berlin", country: "Germany", tz: "Europe/Berlin", lat: 52.52, lon: 13.40 },
  { id: "cai", city: "Cairo", country: "Egypt", tz: "Africa/Cairo", lat: 30.04, lon: 31.24 },
  { id: "joh", city: "Johannesburg", country: "South Africa", tz: "Africa/Johannesburg", lat: -26.20, lon: 28.04 },
  { id: "mos", city: "Moscow", country: "Russia", tz: "Europe/Moscow", lat: 55.76, lon: 37.62 },
  { id: "dub", city: "Dubai", country: "UAE", tz: "Asia/Dubai", lat: 25.20, lon: 55.27 },
  { id: "del", city: "New Delhi", country: "India", tz: "Asia/Kolkata", lat: 28.61, lon: 77.21 },
  { id: "bkk", city: "Bangkok", country: "Thailand", tz: "Asia/Bangkok", lat: 13.76, lon: 100.50 },
  { id: "sin", city: "Singapore", country: "Singapore", tz: "Asia/Singapore", lat: 1.35, lon: 103.82 },
  { id: "hkg", city: "Hong Kong", country: "China", tz: "Asia/Hong_Kong", lat: 22.32, lon: 114.17 },
  { id: "tok", city: "Tokyo", country: "Japan", tz: "Asia/Tokyo", lat: 35.68, lon: 139.65 },
  { id: "syd", city: "Sydney", country: "Australia", tz: "Australia/Sydney", lat: -33.87, lon: 151.21 },
  { id: "auc", city: "Auckland", country: "New Zealand", tz: "Pacific/Auckland", lat: -36.85, lon: 174.76 },
  { id: "hon", city: "Honolulu", country: "USA", tz: "Pacific/Honolulu", lat: 21.31, lon: -157.86 },
  { id: "chi", city: "Chicago", country: "USA", tz: "America/Chicago", lat: 41.88, lon: -87.63 },
  { id: "den", city: "Denver", country: "USA", tz: "America/Denver", lat: 39.74, lon: -104.99 },
  { id: "tor", city: "Toronto", country: "Canada", tz: "America/Toronto", lat: 43.65, lon: -79.38 },
  { id: "mad", city: "Madrid", country: "Spain", tz: "Europe/Madrid", lat: 40.42, lon: -3.70 },
  { id: "ist", city: "Istanbul", country: "Turkey", tz: "Europe/Istanbul", lat: 41.01, lon: 28.98 },
  { id: "sha", city: "Shanghai", country: "China", tz: "Asia/Shanghai", lat: 31.23, lon: 121.47 },
  { id: "seo", city: "Seoul", country: "South Korea", tz: "Asia/Seoul", lat: 37.57, lon: 126.98 },
];

export const DEFAULT_BOARD = ["syd", "lon", "del", "tok", "sf"];
