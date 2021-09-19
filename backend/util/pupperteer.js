const puppeteer = require('puppeteer')
const fs = require('fs');
const logger = require('./winston-logger')





const autoLogin = async (req, res, next) => {
    const username = "peter.do@innetsol.com";
    const passwordCISCO = "IThb1234";
    const login_url = "https://www.cisco.com/c/login/index.html?referer=/c/en/us/index.html"


    // launch the browser
    const browser = await puppeteer.launch(
        {
            //headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
        })

        
    const page = await browser.newPage()
    await page.goto(login_url)
    
   
    await page.evaluate(async ()=>{
        let userInput = document.getElementById('userInput')
            userInput.value = "peter.do@innetsol.com";
            
        })
        await Promise.all([
            page.click('#login-button'),
            page.waitForSelector('#okta-signin-password'),
        ]).then(async ()=>{
            await page.type('#okta-signin-password', 'IThb1234');
            await page.click('#okta-signin-submit')
            //page.screenshot({path: 'buddy2-screenshot.png'})
            await page.waitFor(10000)
            const SN_url = "https://ccrc.cisco.com/ServiceContract/contract/"
            await page.goto(SN_url).then(async ()=>{
                await page.waitFor(10000)
                page.evaluate(() => {
                    let token = sessionStorage.bearerToken
                    console.log(token)
                    return token;
                }).then((token)=>{
                    console.log(token)
                    let save = {
                            token: token
                        }
    
                    fs.writeFile('sessionStorage.txt', JSON.stringify(save), (err) => {
                        if (err) {
                            browser.close()
                            return next(new Error("Cannot read the file authorization"))
                        }
                    })
                    //browser.close()
                }).catch(err=>{
                    console.log(err)
                })
            })
        })
        


    // await page.waitForXPath('//*[@id="userInput"]')
    //     .then(() => {
    //         page.evaluate((passwordCISCO) => {
    //             let userInput = document.getElementById('userInput')
    //             userInput.value = "peter.do@innetsol.com";
    //             console.log('putting in username')
    //             // const passwordInput = "password";
    //             // const submitId = "kc-login";
    //             // let submitSelector = document.getElementById(submitId);
    //             // let passwordSelector = document.getElementById(passwordInput);
    //             // passwordSelector.value = 'IThb1234'
    //             // submitSelector.removeAttribute("disabled")
    //         }, passwordCISCO);

    //     })
    //     .catch((err) => {
    //         logger.error("Error at finding username in util/puppeteer autologin function")
    //         logger.error(err)
    //         console.log("Error at finding username in util/puppeteer autologin function")
    //         console.log(err)
    //         browser.close()
    //         return next(new Error("Error at finding username in util/puppeteer autologin function"))
    //         // res.status(500).end("Error at finding password in util/puppeteer autologin function")
    //     })


    // // type username
    // await Promise.all([
    //     page.waitFor('//*[@id="userInput"]')
    // ]).then(() => {
    //     page.focus('#userInput')

    //     page.keyboard.type('#userInput', 'userInpuaeft')
    // })
    //     .catch((err) => {
    //         logger.error("Error at finding/typing username in util/puppeteer autologin function")
    //         logger.error(err)
    //         browser.close()
    //         return next(new Error("Server error"))
    //     })

        // page.waitFor(2000)
        // .then(() => page.click('#login-button'))

    // // //submit the form (login button)
    // try {
    //     await page.click('#login-button')
    // } catch (error) {
    //     logger.error("Cannot find the login button to click in username page in cisco site")
    //     logger.error(error)
    //     browser.close()
    //     return next(new Error("Cannot find the login button to click in username page in cisco site"))
    //     // return res.status(500).end("Cannot find the login button to click in username page in cisco site")
    // }

    // await page.waitForSelector('#password')
    //     .then(() => {
    //         page.evaluate((passwordCISCO) => {
    //             const passwordInput = "password";
    //             const submitId = "kc-login";
    //             let submitSelector = document.getElementById(submitId);
    //             let passwordSelector = document.getElementById(passwordInput);
    //             passwordSelector.value = 'IThb1234'
    //             submitSelector.removeAttribute("disabled")
    //         }, passwordCISCO);

    //     })
    //     .catch((err) => {
    //         logger.error("Error at finding password in util/puppeteer autologin function")
    //         logger.error(err)
    //         console.log("Error at finding password in util/puppeteer autologin function")
    //         console.log(err)
    //         browser.close()
    //         return next(new Error("Error at finding password in util/puppeteer autologin function"))
    //         // res.status(500).end("Error at finding password in util/puppeteer autologin function")
    //     })
    // await page.waitFor(1000);

    // try {
    //     await page.click('#kc-login');
    // } catch (err) {
    //     logger.error("Cannot find the login button to click in password page in cisco site")
    //     logger.error(err)
    //     console.log("Cannot find the login button to click in password page in cisco site")
    //     console.log(err)
    //     browser.close()
    //     return next(new Error("Cannot find the login button to click in password page in cisco site"))
    //     // return res.status(500).end("Cannot find the login button to click in password page in cisco site")
    // }

    // await page.waitFor(5000)
    //     .then(async () => {
    //         // await console.log(cookies)
    //         const SN_url = "https://ccrc.cisco.com/ServiceContract/contract/"
    //         await page.goto(SN_url)
    //         .then(async () => {
    //             page.evaluate(() => {
    //                 let token = sessionStorage.getItem('bearerToken')
    //                 return token;
    //             }).then((token) => {
    //                 let save = {
    //                     token: token
    //                 }

    //                 fs.writeFile('sessionStorage.txt', JSON.stringify(save), (err) => {
    //                     if (err) {
    //                         browser.close()
    //                         return next(new Error("Cannot read the file authorization"))
    //                     }
    //                     browser.close()
    //                 });
    //             })
    //         })
    //         .catch((err) => {
    //             browser.close()
    //             return next(new Error("Cannot find the iframe in tokennnnnnn"))
       
    //         })
    //         // const searchXpath = '//*[@id="subHeader"]/section/div[1]/span/a/img'
    //         // const searchXpath = '//*[@id="root"]/section/div/div[@id="wsMenubarTemplDiv"]/div/div/div[@class="col col-sm-4 d-none d-sm-none d-md-block mr-auto"]/a'

    //         // await page.waitForXPath(searchXpath)
    //             // .then(async () => {
    //             //     page.evaluate(() => {
    //             //         let token = sessionStorage.getItem('bearerToken')
    //             //         return token;
    //             //     }).then((token) => {
    //             //         let save = {
    //             //             token: token
    //             //         }

    //             //         fs.writeFile('sessionStorage.txt', JSON.stringify(save), (err) => {
    //             //             if (err) {
    //             //                 browser.close()
    //             //                 return next(new Error("Cannot read the file authorization"))
    //             //             }
    //             //             browser.close()
    //             //         });
    //             //     })
    //             // })
    //             // .catch((err) => {
    //             //     browser.close()
    //             //     return next(new Error("Cannot find the iframe in tokennnnnnn"))
           
    //             // })
    //     })
     

    await next()
}
//Do not use
const betterAutoLoginPromise = () =>{
    console.log('logging in from better promise')
    return new Promise(async (resolve,reject) =>{
        const username = "peter.do@innetsol.com";
        const passwordCISCO = "IThb1234";
        const login_url = "https://www.cisco.com/c/login/index.html?referer=/c/en/us/index.html"
    
    
        // launch the browser
        const browser = await puppeteer.launch(
            {
                // headless: false,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            })
    
            
        const page = await browser.newPage()
        await page.goto(login_url)
        
       
        await page.evaluate(async ()=>{
            let userInput = document.getElementById('userInput')
                userInput.value = "peter.do@innetsol.com";
                
            })
            await Promise.all([
                page.click('#login-button'),
                page.waitForSelector('#password'),
            ]).then(async ()=>{
                page.evaluate(() => {
                    const passwordInput = "password";
                    const submitId = "kc-login";
                    let submitSelector = document.getElementById(submitId);
                    let passwordSelector = document.getElementById(passwordInput);
                    passwordSelector.value = 'IThb1234'
                    submitSelector.removeAttribute("disabled")
                    console.log(submitSelector)
                });
                
                page.screenshot({path: 'buddy2-screenshot.png'})
                await Promise.all([
                    page.click('#kc-login'),
                    page.waitForSelector('#wcq')
                ]).then(async ()=>{
                    const SN_url = "https://ccrc.cisco.com/ServiceContract/contract/"
                    await page.goto(SN_url).then(()=>{
                        page.waitForSelector('.SearchInput-SearchKeyButton').then(()=>{
                            page.evaluate(() => {
                                let token = sessionStorage.getItem('bearerToken')
                                return token;
                            }).then((token)=>{
                                let save = {
                                    token: token
                                }
            
                            fs.writeFile('sessionStorage.txt', JSON.stringify(save), (err) => {
                                if (err) {
                                    browser.close()
                                    return next(new Error("Cannot read the file authorization"))
                                }
                            })
                                resolve(token)
                                browser.close()
                            }).catch(err=>{
                                console.log(err)
                                reject(err)
                            })
                        })
                    })
                })
            })
    })
}

// make a promise, Do not use
const autologinPromise = () => {
    return new Promise(async (resolve, reject) => {
        const username = "peter.do@innetsol.com";
        const passwordCISCO = "IThb1234";
        const browser = await puppeteer.launch(
            {
                // headless: false,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            })
        const page = await browser.newPage()
        const login_url = "https://www.cisco.com/c/login/index.html?referer=/c/en/us/index.html"
        await page.goto(login_url)

        // type username
        await Promise.all([
            page.waitFor('//*[@id="userInput"]')
        ]).then(() => page.type('#userInput', username))
            .catch((err) => {
           
                browser.close()
                reject(err)
            })

        // submit the form (login button)
        // try {
        //     // await page.click('#login-button')
        // } catch (error) {
        //     logger.error("Cannot find the login button to click in username page in cisco site")
        //     logger.error(error)
        //     browser.close()
        //     reject(error)
        // }

        await page.waitForSelector('#password')
            .then( () => {
                page.evaluate((passwordCISCO) => {
                    const passwordInput = "password";
                    const submitId = "kc-login";
                    let submitSelector = document.getElementById(submitId);
                    let passwordSelector = document.getElementById(passwordInput);
                    passwordSelector.value = 'IThb1234'
                    submitSelector.removeAttribute("disabled")
                }, passwordCISCO);

            })
            .catch((err) => {
                logger.error("Error at finding password in util/puppeteer autologin function")
                logger.error(err)
                console.log("Error at finding password in util/puppeteer autologin function from Promise")
                console.log(err+"from Promise")
                browser.close()
                reject(err)
            })
        await page.waitFor(1000);

        try {
            await page.click('#kc-login');
        } catch (err) {
            logger.error("Cannot find the login button to click in password page in cisco site")
            logger.error(err)
            console.log("Cannot find the login button to click in password page in cisco site from Promise")
            console.log(err+"from Promise")
            browser.close()
            reject(err)
        }

        await page.waitFor(5000)
            .then(async () => {

                const SN_url = "https://ccrc.cisco.com/ServiceContract/contract/"
                await page.goto(SN_url);
                const searchXpath = '//*[@id="subHeader"]/section/div[1]/span/a/img'
        
                await page.waitForXPath(searchXpath)
                    .then(async () => {
                        page.evaluate(() => {
        
                            let token = sessionStorage.getItem('bearerToken')
                            return token;
                        }).then((token) => {
                            let save = {
                                token: token
                            }
        
                            fs.writeFile('sessionStorage.txt', JSON.stringify(save), (err) => {
                                if (err) {
                                    logger.error("Cannot read the file authorization")
                                    logger.error(err)
                                    console.log("Cannot read the file authorization"+"from Promise")
                                    console.log(err+"from Promise")
                                    reject(err)
                                }
                                browser.close()
                            });
        
                            browser.close()
                            resolve(token)
                        })
                    })
                    .catch((err) => {
                        logger.error("Cannot find the iframe in token")
                        logger.error(err)
                        console.log("Cannot find the iframe in token"+"from Promise")
                        console.log(err+"from Promise")
                        browser.close()
                        reject(err)
                    })
              
            });
    });
}


const readSession = async (req, res, next) => {
    await fs.readFile('sessionStorage.txt', function (err, data) {
        if (err) {
            console.log('reading session has error')
            return res.status(500).end("Can't read the file")
        } else {
            console.log('reading the session')
            let token = JSON.parse(data)
            req.auth = token.token
            console.log('token: '+req.auth)
            return next()
        }
    });
}


const checkSN = async (page) => {
    const searchXpath = '//*[@id="d1"]/ng-shim/iframe'
    page.waitForXPath(searchXpath)
        .then(async () => {
            let frames = await page.frames()[0]
            frames.$('body > app-root > app-landing-page > div > app-side-menu > aside > app-landing-page-filters > app-multi-search-input > app-search-input > div > input')
                .then((e) => console.log(e))

        })
}




module.exports.readSession = readSession
module.exports.checkSN = checkSN
module.exports.autoLogin = autoLogin
module.exports.autologinPromise = autologinPromise
module.exports.betterAutoLoginPromise = betterAutoLoginPromise
