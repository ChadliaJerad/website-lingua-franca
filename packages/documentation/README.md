# Documentation

This package serves as the entry point for adding handbook-specific pages. These are the pages that appear in the **handbook** portion of the web page as well as the generated Epub and PDF documentation.

Each documentation file is a markdown file with the following steps needed to add them to the handbook.

1. Under `copy/en` is the directory structure for the handbook. It contains the following subdirectories:
   - **topics**: Tutorial-style documentation supporting all target languages.
   - **reference**: Detailed documentation including some target-language-specific files.
   - **preliminary**: Documentation for tools or features that at early stages of development.
   - **less-developed**: Documentation for incomplete or speculative work.
   - Note: By default, the Epub/PDF is only populated with pages organized under **topics**. **FIXME:** This needs to be changed to include also the reference section.
2. At the top of each markdown page, the following blurb instructs the Gatsby website builder to automatically create a page with title _YOUR_TITLE_HERE_ at location `/docs/handbook/PERMALINK_LOCATION`:

```
---
title: YOUR_TITLE_HERE
layout: docs
permalink: /docs/handbook/PERMALINK_LOCATION
oneline: ONE_LINE_HERE
preamble: >
---
```

3. Now we need to instruct our handbook to enforce a sidebar structure. Navigate to the following script file: `packages/documentation/scripts/generateDocsNavigationPerLanguage.js`
   - This TS file enforces the documentation structure on the sidebar and docs page. The structure is as follows under the handbookPages value:
   ```
   {
       title: "Topics",
   summary: "A great first read for your daily Lingua Franca work.",
   chronological: true,
   items: [
     { file: "topics/Overview.md" },
     { file: "topics/Tutorial.md" },
     {
       title: "Language Specification",
       chronological: true,
       items: [
           ...
       ]
     },
     ...
   }
   ...
   ```
   - This outer layer enforces Topics as a parent to the Overview/Tutorial pages as well as the inner layer of Language Specification.
   - You can add a layer by including a key-value map similar to Topics (for outer layers) and Language Specification (for inner layers).
   - Additional information of how to add attributes can be found at the top of the `generateDocsNavigationPerLanguage.js` file.
4. To include your file under a layer, simply add a file keypair using relative paths to `copy/en`
   - Example: if you want to include a file with the following path
     `packages/documentation/copy/en/topics/Overview.md`
   - Then create a file attribute as so under an items object:
     `{ file: "topics/Overview.md" },`
5. Whenever the structure is changed, simply rerun `yarn bootstrap` to propagate changes to lingua-franca.

**NOTE**: Be sure the titles in your files are unique or yarn will get confused about which file to show.
