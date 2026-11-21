# Data Science Notebook

Interactive lessons on statistics, machine learning, and AI. The first three lessons cover linear regression, logistic regression, and decision trees. The examples use simulated data.

**English** is the default. **Português** and **Español** are available from every page. Each version includes the complete theory, equations, lab, review questions, and references.

## Open locally

Extract the ZIP and open `index.html`. Keep the folders alongside it. The lessons and labs work offline. External reference links require internet access. Notes are kept in browser storage when available, and can also be downloaded.

## Publish on GitHub Pages

Commit the files and folders in this package to the root of the repository on `main`. In **Settings → Pages**, select **Deploy from a branch**, **main**, and **/(root)**. Save the settings. The `.nojekyll` file lets GitHub Pages serve the static files directly. See the [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Add a lesson

Add the same filename at the root for English and under `pt/` and `es/`. Keep the same section IDs so the language switch can retain the current section. Link each lesson from the three indexes. Share computation and styling in `assets/`, and add any interface strings to `assets/strings.js`. Keep citations near the relevant passages and include the references on each version of the page.
