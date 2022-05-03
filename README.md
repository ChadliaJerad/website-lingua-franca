# The Lingua Franca website

## Getting Started

This repo uses [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) with node 16, and [watchman](https://facebook.github.io/watchman/docs/install.html).

The main website source files are located in packages/lingua-franca/src/templates/pages and the documentation files are located in packages/documentation/copy/en.

(Windows users can install [watchman via chocolatey](https://chocolatey.org/packages/watchman))

For switching to Node Version 16, consult this [repo](https://github.com/nvm-sh/nvm) for Linux and Mac and this [repo](https://github.com/coreybutler/nvm-windows) for Windows.

With set up done on your local machine, clone this repo and run the following commands.

```sh
git submodule update --init
yarn install
code .

# Then:
yarn bootstrap

# Now you can start up the website
yarn start
```

Working on this repo is done by running `yarn start` - this starts up the website on port `8000` and creates a
builder worker for every package in the repo, so if you make a change outside of the site it will compile and lint etc.

Some useful knowledge you need to know:

- All packages have: `yarn build` and `yarn test`
- All packages use [debug](https://www.npmjs.com/package/debug) - which means you can do `env DEBUG="*" yarn test` to get verbose logs

Working on this repo is done by running `yarn start` -- this starts up the website on port `8000` and creates a
builder worker for every package in the repo, so if you make a change outside of the site it will compile.

## Deployment

Deployment is done automatically through a GitHub Pages Action. Feel free to look at .github/workflows/deploy-website.yml to see how it works!

## Docs

If you want to know _in-depth_ how the framework behind this website was _originally_ architected, see [this YouTube video](https://www.youtube.com/watch?v=HOvivt6B7hE).

## Packages

The Lingua-Franca website is organized under three [packages](https://github.com/lf-lang/website-lingua-franca/tree/main/packages) whose purposes are outlined below.

---

### Lingua-Franca

The main website for Lingua Franca, a Gatsby website which is statically deployed. You can run it via:

```sh
yarn start
```

#### Generic Pages

Generic Pages (i.e., pages tied solely to the website and not to the documentation handbook) are handled solely by the lingua-franca package. 

#### Contributors

To add yourself to the list of community contributors, simply add your information to the [`Community.tsx`](https://github.com/lf-lang/website-lingua-franca/blob/main/packages/lingua-franca/src/templates/pages/community.tsx) file.

*For more information on adding pages and contributors, consult the [README](https://github.com/lf-lang/website-lingua-franca/tree/main/packages/lingua-franca/README.md) in the [`lingua-franca`](https://github.com/lf-lang/website-lingua-franca/tree/main/packages/lingua-franca) package.*

---

#### Documentation

The Documentation package serves as the primary point for adding documentation on the Lingua Franca language. Markdown pages defined in this packages are automatically added to the Website Handbook. The Handbook is organized hierarchically by rules defined within the Documentation package.

*For more info on how to add/modify handbook pages, consult the [README](https://github.com/lf-lang/website-lingua-franca/tree/main/packages/documentation/README.md) under the [`documentation`](https://github.com/lf-lang/website-lingua-franca/tree/main/packages/documentation) package.*

---

#### Handbook-Epub

The handbook-epub package converts the handbook defined in documentation into an Epub/PDF friendly version for viewing.

An epub file is automatically generated from the handbook files and is published [here](https://www.lf-lang.org/assets/lingua-franca-handbook.epub). You can also access a PDF version of the handbook [here](https://www.lf-lang.org/assets/lingua-franca-handbook.pdf).

# Legal Notices

The original code base of this website is based on the [TypeScript website](https://github.com/microsoft/TypeScript-Website) which is licenced under [the MIT License](https://opensource.org/licenses/MIT) (see the [LICENSE-CODE](https://github.com/lf-lang/website-lingua-franca/blob/v16/LICENSE-CODE) file). Other content in this repository is licened under the Creative Commons Attribution 4.0 International Public License (see the [LICENSE](https://github.com/lf-lang/website-lingua-franca/blob/v16/LICENSE-CODE) file). Copyright of changes in this repository after 01/12/2021 is held by the Lingua Franca contributors.
