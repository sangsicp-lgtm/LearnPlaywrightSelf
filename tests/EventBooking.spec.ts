import { test, expect } from '@playwright/test';

test('EventCreationFlow', async ({ page }) => {

  await page.goto('https://eventhub.rahulshettyacademy.com/login');
  const emailInput="rad.deo@email.com";
  const passwordInput="Pass123!";

  //Step 1
  await page.getByPlaceholder('you@email.com').fill(emailInput);
  await page.getByLabel('Password').fill(passwordInput);
  await page.locator('#login-btn').click();
  await expect (page.getByText('Browse Events →')).toBeVisible();

  //Step 2 — Create a new event
   await page.goto('https://eventhub.rahulshettyacademy.com/admin/events'); 

   const EventId= 'TestEvent$'+ Date.now();
   console.log("EventId: " + EventId);
   await page.locator('#event-title-input').fill(EventId);
   await page.locator('#admin-event-form textarea').fill("Test Event for testing purpose");
   await page.getByLabel('City').fill('Mumbai');
   await page.getByLabel('Venue').fill('G T Hall');
   await page.getByLabel('Event Date & Time').fill('2027-12-31T10:00');
   await page.getByLabel('Price ($)').fill('100');
   await page.getByLabel('Total Seats').fill('50');
   await page.locator('#add-event-btn').click();
   await expect(page.getByText('Event created!')).toBeVisible();


  //Step 3 — Find the event card and capture seats
  await page.goto('https://eventhub.rahulshettyacademy.com/events');
  const event_cards= await page.locator('#event-card');

  await expect(event_cards.first()).toBeVisible();
  await expect(event_cards.filter({ hasText: EventId })).toBeVisible({timeout:5000 });
  const EventInfo=await event_cards.filter({ hasText: EventId });

  const seats= await EventInfo.getByText(' seats available').innerText();
  const seatsBeforeBooking= parseInt(seats.split(' ')[0]);
  console.log("seatsBeforeBooking: " + seatsBeforeBooking);

//Step 4 — Start booking

await EventInfo.locator('[data-testid="book-now-btn"]').click();

//Step 5 — Fill booking form
await expect(page.locator("#ticket-count")).toHaveText("1");
await page.getByLabel('Full Name').fill('don');
await page.locator('#customer-email').fill(emailInput);
await page.getByPlaceholder('+91 98765 43210').fill('1234567890');
await page.locator('.confirm-booking-btn').click();


//Step 6 — Verify booking confirmation
const bookingInfo= await page.locator('.booking-ref').first();
await expect(bookingInfo).toBeVisible();
const bookingRef= (await bookingInfo.innerText()).trim();
console.log("Booking Reference: " + bookingRef);

//Step 7 — Verify in My Bookings

await page.getByRole('link',{name:'View My Bookings'}).click();

await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com/bookings');

const bookingCarts= await page.locator('#booking-card');

await expect(bookingCarts.first()).toBeVisible();
const matchedBookingCard= bookingCarts.filter({ hasText: bookingRef });

await expect(matchedBookingCard).toBeVisible();
await expect(matchedBookingCard.locator('h3')).toHaveText(EventId);

//Step 8 — Verify seat reduction
await page.goto('https://eventhub.rahulshettyacademy.com/events'); 
await page.locator('#event-card').first().waitFor();
await expect(page.locator('#event-card').first()).toBeVisible();

const EventInfoSeatCheck=page.locator('#event-card').filter({hasText: EventId});
await expect(EventInfoSeatCheck).toBeVisible();

const verifySeats= await EventInfoSeatCheck.getByText(' seats available').innerText();
const seatsAfterBooking= parseInt(verifySeats.split(' ')[0]);

console.log("SeatsAfterBooking: " + seatsAfterBooking);
  

});
