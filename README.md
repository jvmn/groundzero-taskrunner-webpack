# Jung von Matt/Neckar - GroundZero Taskrunner

## What is this script doing?

In charge of running the dev / build / release / deploy / newpattern toolchain for groundzero projects by providing a simple CLI.

*** This package is a dependencie of JvM/Neckar Groundzero, will not work as a standalone ***

## Installation

1) npm install:
    ```
    npm install @jvmn/groundzero-taskrunner-webpack --save-dev
    ```

2) get all coomand options by running from the terminal:
    ```
    groundzero help
    ```
* for convinence, groundzero projects should also come with mapped npm commands to the CLI.

* if you need to overwrite some config files in your project, copy-paste the config you need from the "config-templates" folder to your project root folder and edit as you wish. 

## Development

For development of the ***taskrunner***, you would want to:
1) clone the repo and install it.
2) clone the latest groundzero-pattern repo, install it and run within-it: 
```
npm link path/to/taskrunner
````
3) this would map the taskrunner repo to run as a native node_modules package in the groundzero-pattern, giving you the ability to develope without the need to rebuild and quickly run the tasks against a sample groundzero project