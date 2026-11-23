import { test, expect } from '@playwright/test';

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const emailInput="rad.deo@email.com";
const passwordInput="Pass123!";

async function loginAndGoToBooking(page) {

  await page.getByPlaceholder('you@email.com').fill(emailInput);
  await page.getByLabel('Password').fill(passwordInput);
  await page.locator('#login-btn').click();
  await expect(page.getByText('Browse Events →')).toBeVisible();

}


//Test 1 — Single ticket booking is eligible for refund
test('Single ticket booking is eligible for refund flow', async ({ page }) => {

    await page.goto(BASE_URL+'/login');
    await loginAndGoToBooking(page);

    //Step 2 — Book first event with 1 ticket (default)
    await page.goto(BASE_URL+'/events');
    await page.locator('#event-card').first().waitFor();
    await page.locator('#event-card').first().locator('#book-now-btn').click();
    await page.getByLabel('Full Name').fill('john deo');
    await page.getByLabel('Email').fill('pqr.stu@email.com');
    await page.getByLabel('Phone Number').fill('1234567890');
    await page.locator('.confirm-booking-btn').click();

   // Step 3 — Navigate to booking detail
    await page.getByRole('link',{name: 'View My Bookings'}).click();
    await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com/bookings');
    const bookingCarts= await page.locator('#booking-card');
    await expect(bookingCarts.first()).toBeVisible();
    await bookingCarts.first().getByRole('button',{name: 'View Details'}).click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    //Step 4 — Validate booking ref
    const bookingRef = await page.locator('.font-mono.font-bold.text-indigo-600.bg-indigo-50.px-3.py-1.rounded-lg.text-sm').innerText();
    console.log("Booking Reference: " + bookingRef);
    const EventName = await page.locator('h1.text-2xl.font-bold.text-gray-900').innerText();
    console.log("EventName: " + EventName);
    await expect(bookingRef.at(0)).toEqual(EventName.at(0));


    //Step 5 — Check refund eligibility

    await page.locator('#check-refund-btn').click();
    await expect(page.locator('#refund-spinner')).toBeVisible();
    await expect(page.locator('#refund-spinner')).not.toBeVisible({timeout: 6000});

    //Step 6 — Validate result
    const refundResult=await page.locator('#refund-result');
    await expect(refundResult).toBeVisible();
    await expect(refundResult).toContainText('Eligible for refund.');
    await expect(refundResult).toContainText('Single-ticket bookings qualify for a full refund.');


})

//Test 2 — Group ticket booking is NOT eligible for refund
test.only('Group ticket booking is NOT eligible for refund flow', async ({ page }) => {

    await page.goto(BASE_URL+'/login');
    await loginAndGoToBooking(page);

    //Step 2 — Book first event with 1 ticket (default)
    await page.goto(BASE_URL+'/events');
    await page.locator('#event-card').first().waitFor();
    await page.locator('#event-card').first().locator('#book-now-btn').click();
    //book upto 3 tickets
    await page.getByRole('button',{name:'+'}).click();
    await page.getByRole('button',{name:'+'}).click();

    await page.getByLabel('Full Name').fill('john deo');
    await page.getByLabel('Email').fill('pqr.stu@email.com');
    await page.getByLabel('Phone Number').fill('1234567890');
    await page.locator('.confirm-booking-btn').click();

  // Step 3 — Navigate to booking detail
    await page.getByRole('link',{name: 'View My Bookings'}).click();
    await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com/bookings');
    const bookingCarts= await page.locator('#booking-card');
    await expect(bookingCarts.first()).toBeVisible();
    await bookingCarts.first().getByRole('button',{name: 'View Details'}).click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    //Step 4 — Validate booking ref
    const bookingRef = await page.locator('.font-mono.font-bold.text-indigo-600.bg-indigo-50.px-3.py-1.rounded-lg.text-sm').innerText();
    console.log("Booking Reference: " + bookingRef);
    const EventName = await page.locator('h1.text-2xl.font-bold.text-gray-900').innerText();
    console.log("EventName: " + EventName);
    await expect(bookingRef.at(0)).toEqual(EventName.at(0));

    //Step 5 — Check refund eligibility
    await page.locator('#check-refund-btn').click();
    await expect(page.locator('#refund-spinner')).toBeVisible();
    await expect(page.locator('#refund-spinner')).not.toBeVisible({timeout: 6000});

    //Step 6 — Validate result (different assertions)
     const refundResult=await page.locator('#refund-result');
    await expect(refundResult).toBeVisible();
    await expect(refundResult).toContainText('Not eligible for refund. Group bookings (3 tickets) are non-refundable.');
     
})


