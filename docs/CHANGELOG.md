
 *** 

# [1.2.0](https://github.com/jvmn/groundzero-taskrunner-webpack/compare/1.1.2...1.2.0) (03.03.2020)

 ### Breaking changes 
 * Now sets css require in js pattern to load in dev mode only. i.e removes css from bundle in production. Simply remove the condition if needed in production.
 ### Chores

* **pkg:**  update dependencies ([3cb6d86](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/3cb6d86)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @03.03.2020_
* **pkg:**  update lock ([73a663b](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/73a663b)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @03.03.2020_
 ### Documentation

* **readme:**  add pwd hint ([d10edbf](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/d10edbf)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @03.03.2020_
 ### Features

* **pattern:**  use css in js if dev only ([356eef3](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/356eef3)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @03.03.2020_

 *** 

# [1.1.2](https://github.com/jvmn/groundzero-taskrunner-webpack/compare/1.1.1...1.1.2) (13.01.2020)

 ### Breaking changes 
 * Refactored newpattern to support twig and css modules.
 * component/module name is now case sensetive
 * 2 new project config fields were added: 
    * *engineExt* - supports (hbs, twig)
    * *projectCssPrefix* - will add a project prefix to class names
 ### Chores

* **package:**  update dependencies ([e7993e1](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/e7993e1)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @13.01.2020_
 ### Bug Fixes

* **templates:**  config missing comma ([cc1a68f](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/cc1a68f)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @13.01.2020_
 ### Code Refactoring

* **webpack:**  ignore url, grid autoplacment ([8eb15ed](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/8eb15ed)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @13.01.2020_
* **newpattern:**  adapt to twig and css mod ([25aff85](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/25aff85)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @13.01.2020_

 *** 

# [1.1.1](https://github.com/jvmn/groundzero-taskrunner-webpack/compare/1.1.0...1.1.1) (17.12.2019)

 ### Build

* **changelog:**  clear ignores ([6cb0fb6](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/6cb0fb6)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @17.12.2019_
* **twig:**  lock fractal packages ([26305bc](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/26305bc)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @17.12.2019_

 *** 

# [1.1.0](https://github.com/jvmn/groundzero-taskrunner-webpack/compare/1.0.2...1.1.0) (13.12.2019)

 ### Features

* **eslint:**  add missing rules ([f19319c](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/f19319c)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @12.12.2019_
 ### Bug Fixes

* **critical-css:**  use old fn, not webpack ([889e3f5](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/889e3f5)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @13.12.2019_
 ### Code Refactoring

* **cssmod:**  add amp support for critical ([e2df20b](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/e2df20b)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @13.12.2019_

 *** 

# [1.0.2](https://github.com/jvmn/groundzero-taskrunner-webpack/compare/1.0.1...1.0.2) (11.12.2019)

 ### Bug Fixes

* **pkg:**  name ([934af88](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/934af88)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @11.12.2019_

 *** 

# [1.0.1](https://github.com/jvmn/groundzero-taskrunner-webpack/compare/1.0.0...1.0.1) (11.12.2019)

 ### Chores

* **init:**  fork from taskrunner ([cca2153](https://github.com/jvmn/groundzero-taskrunner-webpack/commit/cca2153)) _by [Shachar Leuchter](shachar.leuchter@jvm.de) @11.12.2019_
