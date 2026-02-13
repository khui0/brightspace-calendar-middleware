# Brightspace Calendar Middleware

Docker hostable API endpoint that takes a Brightspace calendar subscription URL and makes each event "all-day" instead of "11:59-11:59"

## How to find Brightspace calendar URL

Go to Brightspace, scroll down to the Calendar section, click the dropdown arrow, click Subscribe

## Run with Docker Compose

Create a `docker-compose.yml` file:

```yml
services:
  brightspace-calendar-middleware:
    image: ghcr.io/khui0/brightspace-calendar-middleware:latest
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      - BRIGHTSPACE_URL=YOUR_CALENDAR_URL
```
