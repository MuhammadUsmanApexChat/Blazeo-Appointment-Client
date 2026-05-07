/**
 * Demo usage of appointment-client
 * Run with: node demo.js
 */
import { 
  initializeAppointmentClient, 
  fetchCalendarDetails 
} from "../dist/index.js"; // In a real app, use 'appointment-client'

async function runDemo() {
  const TEST_CALENDAR_ID = "66f42c26-f48e-4965-b772-88155986898d"; // Example ID
  const BASE_URL = "https://api.blazeo.com"; // Example API URL

  console.log("--- Appointment Client Demo ---");

  // 1. Initialize the client
  console.log(`Initializing client with BASE_URL: ${BASE_URL}`);
  initializeAppointmentClient({
    baseUrl: BASE_URL,
    consumer: "demo-app"
  });

  try {
    // 2. Pass calendarId and fetch details
    console.log(`Fetching details for calendarId: ${TEST_CALENDAR_ID}...`);
    const details = await fetchCalendarDetails(TEST_CALENDAR_ID);

    if (!details.meta.ok) {
      console.error("Failed to fetch calendar details:", details.meta.reason);
      return;
    }

    if (details.calendarView) {
      console.log("\n--- calendarView (preview) ---");
      console.log(
        JSON.stringify({
          members: details.calendarView.members?.length ?? 0,
          openingHours: details.calendarView.openingHours?.length ?? 0,
        })
      );
    }

    // 3. Retrieve and print Opening hours
    console.log("\n--- Opening Hours ---");
    if (details.openingHours.length > 0) {
      details.openingHours.forEach((oh, idx) => {
        console.log(`[${idx + 1}] Day: ${oh.day}, Start: ${oh.startHour}:${oh.startMinute}, End: ${oh.endHour}:${oh.endMinute}`);
      });
    } else {
      console.log("No opening hours found.");
    }

    // 4. Retrieve and print Participants
    console.log("\n--- Participants ---");
    if (details.participants.length > 0) {
      details.participants.forEach((p, idx) => {
        console.log(`[${idx + 1}] Name: ${p.name}, Email: ${p.email || 'N/A'}`);
      });
    } else {
      console.log("No participants found.");
    }

    console.log("\nDemo completed successfully.");

  } catch (error) {
    console.error("An error occurred during the demo:", error.message);
  }
}

runDemo();
