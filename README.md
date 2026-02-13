# Brightspace Calendar Middleware

Docker hostable API endpoint that takes a Brightspace calendar subscription URL and makes each event "all-day" instead of "11:59-11:59"

## Why?

Brightspace assignments that are due at 11:59 PM will be shown like this in Apple Calendar

<img width="367" height="40" alt="image" src="https://github.com/user-attachments/assets/32f66d5b-1378-49be-927c-c211daeec868" />

This service turns those events that are from 11:59 to 11:59 into "all-day" events show they're shown like this

<img width="352" height="94" alt="image" src="https://github.com/user-attachments/assets/1e8027a1-9fc6-4046-b01b-0697948ba559" />

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
