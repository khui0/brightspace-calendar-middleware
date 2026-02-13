import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import type { Request, Response } from "express";
import express from "express";
import { createEvents, type DateTime, type EventAttributes } from "ics";
import ical from "node-ical";

dayjs.extend(utc);
dayjs.extend(timezone);

const app = express();
const PORT = process.env.PORT || 3000;
const BRIGHTSPACE_URL = process.env.BRIGHTSPACE_URL;
const TIMEZONE = process.env.TZ || "America/New_York";

if (!BRIGHTSPACE_URL) {
  console.error("BRIGHTSPACE_URL is undefined");
  process.exit(1);
}

app.get("/", async (req: Request, res: Response) => {
  try {
    const response = await axios.get(BRIGHTSPACE_URL, {
      responseType: "text",
    });

    const events = ical.parseICS(response.data);
    const transformed: EventAttributes[] = [];

    // console.log(events);

    for (const key in events) {
      const event = events[key];
      if (event?.type !== "VEVENT") continue;

      const start = dayjs(event.start).tz(TIMEZONE);
      const end = dayjs(event.end).tz(TIMEZONE);

      const endOfDay: boolean =
        start.hour() === 23 &&
        start.minute() === 59 &&
        end.hour() === 23 &&
        end.minute() === 59;

      const allDayStart: DateTime = [
        start.year(),
        start.month() + 1,
        start.date(),
      ];

      const allDayEnd: DateTime = [
        start.add(1, "day").year(),
        start.add(1, "day").month() + 1,
        start.add(1, "day").date(),
      ];

      const newEvent: EventAttributes = {
        title: event.summary.toString() || "",
        description: event.description?.toString() || "",
        location: event.location?.toString() || "",
        uid: event.uid?.toString(),
        start: endOfDay ? allDayStart : start.valueOf(),
        end: endOfDay ? allDayEnd : end.valueOf(),
        sequence: event.sequence ? Number(event.sequence) : 0,
        productId: "-//KENNYHUI//NONSGML kennyhui.dev//EN",
      };

      transformed.push(newEvent);
    }

    const { error, value } = createEvents(transformed);

    if (error) {
      console.error("Error generating ICS:", error);
      res.status(500);
      return;
    }

    console.log(
      `[${dayjs().toISOString()}] Generated ICS with ${transformed.length} events`,
    );

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="brightspace.ics"',
    );
    res.send(value);
  } catch (err) {
    console.error(`Failed to fetch: ${err}`);
    res.status(500);
  }
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default app;
