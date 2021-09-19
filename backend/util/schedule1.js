const schedule = require('node-schedule');

const pupperteer = require('./pupperteer')
schedule.scheduleJob('*/20 * * * *', async () => {

  pupperteer.autologinPromise().then((data) => {
    

  })
    .catch(err => {
      // throw new Error("From schedule")
      console.log(err)

    })

});
