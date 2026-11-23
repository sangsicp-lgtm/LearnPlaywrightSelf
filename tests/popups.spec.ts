import {test,expect} from '@playwright/test';

test('Popup test', async ({page}) =>{

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    page.on('dialog', dialog => dialog.accept());
    await page.locator('#confirmbtn').click();
    await page.pause();
    await page.locator('#mousehover').hover();

    const frames=await page.frameLocator('#courses-iframe');
    frames.locator('li a[href*=lifetime-access]:visible').click();
    const textCheck=await frames.locator('.text h2').innerText();
    console.log("textCheck: " + textCheck.split(' ')[1]);
 
})


