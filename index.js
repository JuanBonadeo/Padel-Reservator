const express = require("express");
const puppeteer = require("puppeteer");
const cron = require("node-cron") 
const PORT = process.env.PORT || 4000
const app = express()


const run4 = async (res) => {
      const browser = await puppeteer.launch(
            { headless: false }
      )
      const page = await browser.newPage()
      await page.goto('https://www.rckbracquetgarden.com/users/sign_in')
      //inicio de sesion
      await page.focus('input[name="user[email]"]')
      await page.keyboard.type("Lucasmartinez255@gmail.com")
      await page.focus('input[name="user[password]"]')
      await page.keyboard.type("Pirulo09!p")
      await page.keyboard.press('Enter')
      await page.waitForNavigation()
      // starts the reservation
      await page.goto('https://www.rckbracquetgarden.com/book/ritz-carlton-racquet-garden-key-biscayne')
      //click day
      const ultimoDiaBtn = await page.$(".flex_mobile_button_container > button:last-child");
      await ultimoDiaBtn.click()   
      const ultimoDia = await page.$$eval(".flex_mobile_button_container > button:last-child .day_name", (elements) =>
            elements.map((element) => element.textContent)
      );     
      const dia = ultimoDia[0]
      const cantHorarios = (dia === "Sat" || dia === "Sun") ? 16 : 11; // importante 
      console.log(cantHorarios)

      await page.waitForTimeout(1000);

      //click hour
      const ultimaHora = await page.$(`div.hours_list > button:nth-child(${cantHorarios -1})`);
      await ultimaHora.click()
      const ultimasHora = await page.$(`div.hours_list > button:nth-child(${cantHorarios})`);
      await ultimasHora.click()
      
      await page.waitForTimeout(1000);
      // first next button
      const botonNext = await page.$(".ui.buttons.fluid .ui.icon.small.button.primary");
      await botonNext.click()
      // Complete players
      await page.waitForTimeout(1000);
      for (let i = 0; i < 3; i++) {
            const fistPlayer = await page.waitForSelector(".FacilityItem.flex_align_items_center.mb14 .PlayerSearchListModal");
            await fistPlayer.click()

            
            let botonAdd = await page.waitForSelector('.PlayerSearchList .mt20:last-child .PlayerList .flex_align_items_center .display_flex button' );
            await botonAdd.click()
            await page.waitForTimeout(1000);

            let botonName1 = await page.waitForSelector(`body > div.body_wrapper > div.pusher > div.yield_container.pb30 > div > div:nth-child(2) > div > div.ui.attached.segment > div > div:nth-child(2) > div.content.active > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(${i + 2}) > div > div.content > h1 > div > i`);
            await botonName1.click()
            let input = await page.waitForSelector(".p5")
            await input.click()
            await page.keyboard.press('Enter')
      }

      await page.waitForTimeout(1000);
      // go to final step
      const botonNext2 = await page.$("body > div.body_wrapper > div.pusher > div.yield_container.pb30 > div > div:nth-child(2) > div > div.ui.attached.segment > div > div:nth-child(2) > div.content.active > table > tbody > tr > td:nth-child(2) > div.position_sticky_bottom_on_mobile.bk_white.mtb20.ptb10.z-index-1 > div > button");
      await botonNext2.click()
      await page.waitForTimeout(1000);
      // book
      const botonBook = await page.$("body > div.body_wrapper > div.pusher > div.yield_container.pb30 > div > div:nth-child(2) > div > div.ui.attached.segment > div > div:nth-child(3) > div.content.active > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > div.no-border-top > div > div > div > button");
      //await botonBook.click()

}


const task = cron.schedule('0 8 * * *', () => {
    run4();
});

const taskNow = cron.schedule(' * * * * *', () => {
    run4();
    taskNow.destroy();
});

app.get("/", (req, res) => {
res.send("Scheduled paddle match right now with /now and at 7am with /7am ");
});
app.get("/7am", (req, res) => {
task.start();
res.send("Scheduled task will start running at 8 AM! timezone:Buenos Aires");
});

app.get("/now", async (req, res) => {
taskNow.start()
res.send("Scheduled task will start in x seconds");
});

app.listen(PORT, () => {
console.log(`listening on port ${PORT}`)
})