# Deploy Application #

## Install

### _Install npm dependencies_

`npm install`


### _Clone environment variables to your environment_

`npm run createenv {username} {password} {project}`

where username and password are the credentials to connect to openshift

### _Create Docker_
`npm run createdocker {project} 49161 8081`
where first port is the designated port to access the application and the second one is the internal port on the docker usually it is always 8081

# README #

Documentation can be found on the following link:
[API Documentation](https://bankaudigroup.atlassian.net/wiki/display/DEVAREA/API)