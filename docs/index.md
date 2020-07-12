# Vue Select 4.0

It's time for a ground up rewrite of Vue Select. The component has been around
since 2016, and has since seen 3 major version bumps. 2x -> 3.x was the largest
change to date, and the update from 3.x -> 4.x will be significantly larger.

It's hard to know when a ground up rewrite is in order for any product. I
originally built Vue Select with the goal of eliminating the need to bring
jQuery into Vue projects in the early days of the Vue ecosystem. The ecoysystem
has evolved substantially since then, and the foundational principles of what
the library should be have shifted over time. So I'm starting fresh from the
ground up with 4.0.

## 🔬 Guiding Principles

### 1. Accessibility

I've learned a lot about creating accessible components in the last 4 years. The
component has become more accessible over the years, but there are still a
number of problems:

- **Focus Trapping**. The current implementation relies on the search input
  focus state to show/hide the dropdown. This has a lot of shortcomings, and
  hinders creating accessible keyboard navigation. The current setup cannot
  implement the keyboard controls required for the Combobox ARIA spec. Instead
  of relying on the focus of the search `<input />` itself for toggling the
  dropdown, this will be bound to the outer wrapper element.

- **Keyboard Bindings**. The current keybindings do not match the
  recommendations for listbox/combobox in the ARIA spec. The goal here will to
  implement these keybindings and keep keyboard functionality as close to the
  native select as possible.

- **Mobile**. Vue Select is not very friendly on mobile, and the native select
  does a better job of _almost_ everything – it's just missing filtering.

Rewriting the component from the ground up with accessibility as the first
guiding principle will ensure the component is friendly to all users.

### 2. Full Control of Markup

The vast majority of GitHub issues logged would be solved by a more robust
scoped slot system. In 4.0, the dropdown component will be composed of multiple
"primitive", renderless components. The library will expose these components for
use in your projects, and they'll be used to compose the default dropdown.

## 🎯 Not Just a Dropdown

Vue Select 4.0 aims to be the base components used to create accessible controls
for selecting any type of data. The library will provide the primitive
components to build accessible radio buttons, checkboxes, dropdowns, and any
other selecting UIs that you can dream up.
