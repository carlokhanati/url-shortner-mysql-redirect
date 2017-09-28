const proc = require('child_process').exec;

const length = process.argv.length;
const project = process.argv[length - 3];
const tagetPort = process.argv[length - 2];
const applicationPort = process.argv[length - 1];

proc(`docker stop ${project}`, (errStop) => {
  if (errStop) {
    console.error(`exec error: ${errStop}`);
  }
  proc(`docker rm ${project}`, (errRm) => {
    if (errRm) {
      console.error(`exec error: ${errRm}`);
    }
    proc(`docker rmi ${project}`, (errorRmi) => {
      if (errorRmi) {
        console.error(`exec error: ${errorRmi}`);
      }
      proc(`docker build -t ${project} .`, (errorBuild) => {
        if (errorBuild) {
          console.error(`exec error: ${errorBuild}`);
          return;
        }
        proc(`docker  run -it --name ${project} -p ${tagetPort}:${applicationPort} -d ${project}`, (errorRun) => {
          if (errorRun) {
            console.error(`exec error: ${errorRun}`);
            return;
          }
          console.log('Docker Created');
        });
      });
    });
  });
});
