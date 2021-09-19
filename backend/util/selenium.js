const { Builder, By, until } = require('selenium-webdriver');
const selenium = require('selenium-webdriver')
const chromium = require('chromium');
// require('chromedriver');
const chrome = require('selenium-webdriver/chrome');
// let o = new chrome.Options();
// o.addArguments('disable-infobars');
// o.setUserPreferences({ credential_enable_service: false });

class Selenium {
    constructor() {
        let options = new chrome.Options();
        options.setChromeBinaryPath(chromium.path);
        // options.addArguments('--headless');
        options.addArguments('--disable-gpu');
        options.addArguments('--window-size=1280,960');


        this.driver = new Builder()
            .setChromeOptions(options)
            .forBrowser('chrome')
            .build();
    }



    // // visit a webpage
    // this.visit = async function (theUrl) {
    //     return await this.driver.get(theUrl);
    // };


    // // quit current session
    // this.quit = async function() {
    //     return await this.driver.quit();
    // };
}

module.exports = Selenium