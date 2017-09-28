const proc = require('child_process').exec;
const fs = require('fs');

const length = process.argv.length;
const username = process.argv[length - 3];
const password = process.argv[length - 2];
const project = process.argv[length - 1];
const cmd = `oc login -u ${username} -p ${password}`;
proc(cmd, (errorLogin) => {
  if (errorLogin) {
    console.error(`exec error: ${errorLogin}`);
    return;
  }
  proc('oc project aleph-sit', (errorProject) => {
    if (errorProject) {
      console.error(`exec error: ${errorProject}`);
      return;
    }
    proc(`oc env dc/${project} --list`, (error, stdout) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      const env = `${stdout}URL_HOST=http://localhost:8081`;
      fs.writeFile('.env', env, (err) => {
        if (err) {
          console.log(err);
        }
        console.log('Environment file created');
      });
    });
  });
});
