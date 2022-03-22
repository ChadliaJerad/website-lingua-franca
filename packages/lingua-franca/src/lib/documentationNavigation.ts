/* This function is completely auto-generated via the `yarn bootstrap` phase of
   the app. You can re-run it when adding new localized handbook pages by running:

   yarn workspace documentation create-handbook-nav

   Find the source of truth at packages/documentation/scripts/generateDocsNavigationPerLanguage.js
*/

export interface SidebarNavItem {
  title: string;
  id: string;
  permalink?: string;
  chronological?: boolean;
  oneline?: string;
  items?: SidebarNavItem[];
}

/** ---INSERT--- */

export function getDocumentationNavForLanguage(
  langRequest: string
): SidebarNavItem[] {
  const langs = ["en"];
  const lang = langs.includes(langRequest) ? langRequest : "en";
  const navigations: Record<string, SidebarNavItem[]> = {};

  navigations.en = [
    {
      title: "Topics",
      oneline: "A great first read for your daily Lingua Franca work.",
      id: "topics",
      chronological: true,

      items: [
        {
          title: "Overview",
          id: "0-overview",
          permalink: "/docs/handbook/overview",
          oneline: "Overview of Lingua Franca.",
        },
        {
          title: "Tutorial",
          id: "0-tutorial",
          permalink: "/docs/handbook/tutorial",
          oneline: "Tutorial of Lingua Franca.",
        },
        {
          title: "Writing Reactors",
          id: "0-writing-reactors",
          oneline: "undefined",
          chronological: true,

          items: [
            {
              title: "A First Reactor",
              id: "0-a-first-reactor",
              permalink: "/docs/handbook/a-first-reactor",
              oneline: "Writing your first Lingua Franca reactor.",
            },
            {
              title: "Composing Reactors",
              id: "0-composing-reactors",
              permalink: "/docs/handbook/composing-reactors",
              oneline: "Composing reactors in Lingua Franca.",
            },
            {
              title: "Parameters and State Variables",
              id: "0-parameters-and-state-variables",
              permalink: "/docs/handbook/parameters-and-state-variables]",
              oneline: "Parameters and state variables in Lingua Franca.",
            },
            {
              title: "Importing and Extending Reactors",
              id: "0-importing-and-extending-reactors",
              permalink: "/docs/handbook/importing-and-extending-reactors",
              oneline: "Importing and extending reactors in Lingua Franca.",
            },
            {
              title: "Multiports and Banks",
              id: "0-multiports-and-banks",
              permalink: "/docs/handbook/multiports-banks",
              oneline: "Multiports and Banks of Reactors.",
            },
            {
              title: "Distributed Execution",
              id: "0-distributed-execution",
              permalink: "/docs/handbook/distributed-execution",
              oneline: "Distributed Execution (preliminary)",
            },
          ],
        },
        {
          title: "Tooling",
          id: "0-tooling",
          oneline: "undefined",
          chronological: true,

          items: [
            {
              title: "Code Plugin",
              id: "0-code-plugin",
              permalink: "/docs/handbook/code-plugin",
              oneline: "Visual Studio Code Plugin for Lingua Franca.",
            },
            {
              title: "Epoch IDE",
              id: "0-epoch-ide",
              permalink: "/docs/handbook/epoch-ide",
              oneline: "Epoch IDE for Lingua Franca.",
            },
            {
              title: "Command Line Tools",
              id: "0-command-line-tools",
              permalink: "/docs/handbook/command-line-tools",
              oneline: "Command-line tools for Lingua Franca.",
            },
            {
              title: "Setup for C",
              id: "0-setup-for-c",
              permalink: "/docs/handbook/setup-for-c",
              oneline: "Set up the C target in Lingua Franca.",
            },
            {
              title: "Setup for Cpp",
              id: "0-setup-for-cpp",
              permalink: "/docs/handbook/setup-for-cpp",
              oneline: "Set up the C++ target in Lingua Franca.",
            },
            {
              title: "Setup for Python",
              id: "0-setup-for-python",
              permalink: "/docs/handbook/setup-for-python",
              oneline: "Set up the Python target in Lingua Franca.",
            },
            {
              title: "Setup for TypeScript",
              id: "0-setup-for-typescript",
              permalink: "/docs/handbook/setup-for-typescript",
              oneline: "Set up the TypeScript target in Lingua Franca.",
            },
            {
              title: "Setup for Rust",
              id: "0-setup-for-rust",
              permalink: "/docs/handbook/setup-for-rust",
              oneline: "Set up the Rust target in Lingua Franca.",
            },
          ],
        },
        {
          title: "Reference",
          id: "0-reference",
          oneline: "undefined",
          chronological: true,

          items: [
            {
              title: "Target Specification",
              id: "0-target-specification",
              permalink: "/docs/handbook/target-specification",
              oneline: "The target specification in Lingua Franca.",
            },
            {
              title: "C Reactors",
              id: "0-c-reactors",
              permalink: "/docs/handbook/c-reactors",
              oneline: "Writing reactors using the C target in Lingua Franca.",
            },
          ],
        },
        {
          title: "Developer",
          id: "0-developer",
          oneline: "undefined",
          chronological: true,

          items: [
            {
              title: "Contributing",
              id: "0-contributing",
              permalink: "/docs/handbook/contributing",
              oneline: "Contribute to Lingua Franca.",
            },
            {
              title: "Downloading and Building",
              id: "0-downloading-and-building",
              permalink: "/docs/handbook/download",
              oneline: "Downloading and Building Lingua Franca.",
            },
            {
              title: "Developer Eclipse setup with Oomph",
              id: "0-developer-eclipse-setup-with-oomph",
              permalink: "/docs/handbook/eclipse-oomph",
              oneline: "Developer Eclipse setup with Oomph.",
            },
            {
              title: "Developer IntelliJ Setup (for Kotlin)",
              id: "0-developer-intellij-setup-(for-kotlin)",
              permalink: "/docs/handbook/intellij-kotlin",
              oneline: "Developer IntelliJ Setup (for Kotlin).",
            },
            {
              title: "Regression Tests",
              id: "0-regression-tests",
              permalink: "/docs/handbook/regression-tests",
              oneline: "Regression Tests for Lingua Franca.",
            },
          ],
        },
      ],
    },
    {
      title: "Preliminary Development",
      oneline: "Capabilities Under Development",
      id: "preliminary-development",
      chronological: false,

      items: [
        {
          title: "Import System",
          id: "1-import-system",
          permalink: "/docs/handbook/import-system",
          oneline: "Import System (preliminary)",
        },
        {
          title: "Tracing",
          id: "1-tracing",
          permalink: "/docs/handbook/tracing",
          oneline: "Tracing (preliminary)",
        },
        {
          title: "Containerized Execution",
          id: "1-containerized-execution",
          permalink: "/docs/handbook/containerized-execution",
          oneline: "Containerized Execution (preliminary)",
        },
        {
          title: "Generic Types, Interfaces, and Inheritance",
          id: "1-generic-types,-interfaces,-and-inheritance",
          permalink: "/docs/handbook/generic-types-interfaces-inheritance",
          oneline: "Generic Types, Interfaces, and Inheritance (preliminary)",
        },
        {
          title: "Target-Supported Features",
          id: "1-target-supported-features",
          permalink: "/docs/handbook/features",
          oneline: "Which features are supported by which target?",
        },
        {
          title: "Writing Reactors in Rust (WIP)",
          id: "1-writing-reactors-in-rust-(wip)",
          permalink: "/docs/handbook/write-reactor-rust",
          oneline: "Writing Reactors in Rust  (preliminary)",
        },
      ],
    },
    {
      title: "Less Developed Topics",
      oneline: "Less Developed Topics in Progress",
      id: "less-developed-topics",
      chronological: false,

      items: [
        {
          title: "Tools",
          id: "2-tools",
          permalink: "/docs/handbook/tools",
          oneline: "LF Tools.",
        },
        {
          title: "Timing Analysis",
          id: "2-timing-analysis",
          permalink: "/docs/handbook/timing-analysis",
          oneline: "Timing Analysis.",
        },
        {
          title: "Related Work",
          id: "2-related-work",
          permalink: "/docs/handbook/related-work",
          oneline: "Related Work",
        },
        {
          title: "Future Proof Package/Import System",
          id: "2-future-proof-package/import-system",
          permalink: "/docs/handbook/proof-import",
          oneline: "A future proof package and import system",
        },
        {
          title: "RFC: Modal Models (Draft I)",
          id: "2-rfc:-modal-models-(draft-i)",
          permalink: "/docs/handbook/rfc-modal",
          oneline: "RFC: Modal Models (first draft)",
        },
      ],
    },
  ];

  return navigations[lang];
}

/** ---INSERT-END--- */

const findInNav = (
  item: SidebarNavItem | SidebarNavItem[],
  fun: (item: SidebarNavItem) => boolean
): SidebarNavItem | undefined => {
  if (Array.isArray(item)) {
    for (const subItem of item) {
      const sub = findInNav(subItem, fun);
      if (sub) return sub;
    }
  } else {
    if (fun(item)) return item;
    if (!item.items) return undefined;
    for (const subItem of item.items) {
      const sub = findInNav(subItem, fun);
      if (sub) return sub;
    }
    return undefined;
  }
};

export function getNextPageID(navs: SidebarNavItem[], currentID: string) {
  // prettier-ignore
  const section = findInNav(navs, (i) => i && !!i.items && !!i.items.find(i => i.id === currentID)) || false
  if (!section) return undefined;
  if (!section.chronological) return undefined;
  if (!section.items) return;

  const currentIndex = section.items.findIndex((i) => i.id === currentID);
  const next = section.items[currentIndex + 1];
  if (next) {
    if (next.items) {
      return {
        path: next.items[0].permalink,
        ...section.items[currentIndex + 1],
      };
    } else {
      return {
        path: next.permalink,
        ...section.items[currentIndex + 1],
      };
    }
  }
}

export function getPreviousPageID(navs: SidebarNavItem[], currentID: string) {
  // prettier-ignore
  const section = findInNav(navs, (i) => i && !!i.items && !!i.items.find(i => i.id === currentID)) || false

  if (!section) return undefined;
  if (!section.chronological) return undefined;
  if (!section.items) return;

  const currentIndex = section.items.findIndex((i) => i.id === currentID);
  const prev = section.items[currentIndex - 1];

  if (prev) {
    return {
      path: prev.permalink,
      ...section.items[currentIndex - 1],
    };
  }
}
