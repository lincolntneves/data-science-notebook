# Data Science Notebook

**[Open the interactive Data Science Notebook →](https://lincolntneves.github.io/data-science-notebook/)**

Interactive lessons on statistics, machine learning, and AI. The notebook covers ten models, from linear regression to gradient boosting. The examples use simulated data.

**English** is the default. **Português** and **Español** are available from every page. Each version includes the complete theory, equations, lab, review questions, and references.

## About this project

I’m Lincoln Thiago Neves. Drawing on my background in statistics, I started this notebook to revisit core ideas in statistics, machine learning, and AI and share what I learn. I propose the ideas and choose the topics. ChatGPT creates and organizes the lesson material and builds the site. I curate and review the explanations, examples, and references before publishing.

## Contributing

If you’ve used one of these models in practice, I’d love to hear what you learned. If you spot an error that slipped through my review, please flag it. Corrections, clearer explanations, references, and examples that can be shared publicly are welcome.

- Use a [GitHub issue](https://github.com/lincolntneves/data-science-notebook/issues) to suggest an idea, report an error, or share a practical example. Mention the lesson and add a source or a reproducible example when helpful.
- Use a [pull request](https://github.com/lincolntneves/data-science-notebook/pulls) to propose a specific edit. For lesson changes, identify the affected language versions so the English, Portuguese, and Spanish editions can stay aligned.

I review proposals for technical accuracy, clarity, and fit with the notebook’s study goals. After review, accepted edits go into `main`, which feeds the published site. The Git history records what changed and keeps earlier versions available.

## Lessons

- [Linear regression](linear-regression.html)
- [Logistic regression](logistic-regression.html)
- [Decision tree](decision-tree.html)
- [K-nearest neighbors (KNN)](k-nearest-neighbors.html)
- [Gaussian naive Bayes](gaussian-naive-bayes.html)
- [Linear discriminant analysis (LDA)](linear-discriminant-analysis.html)
- [Quadratic discriminant analysis (QDA)](quadratic-discriminant-analysis.html)
- [Linear support vector machine (SVM)](support-vector-machine.html)
- [Random forest](random-forest.html)
- [Gradient boosting](gradient-boosting.html)

## Open locally

Extract the ZIP and open `index.html`. Keep the folders alongside it. The lessons and labs work offline. External reference links require internet access. Notes are kept in browser storage when available, and can also be downloaded.

## Publish on GitHub Pages

Commit the files and folders in this package to the root of the repository on `main`. In **Settings → Pages**, select **Deploy from a branch**, **main**, and **/(root)**. Save the settings. The `.nojekyll` file lets GitHub Pages serve the static files directly. See the [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Add a lesson

Add the same filename at the root for English and under `pt/` and `es/`. Keep the same section IDs so the language switch can retain the current section. Link each lesson from the three indexes. Share computation and styling in `assets/`, and add any interface strings to `assets/strings.js`. Keep citations near the relevant passages and include the references on each version of the page.

When adding a lesson, start with a plain-language explanation and a concrete example in all three languages. Define unfamiliar terms before using them, then show a worked example and guide the reader through one change in the lab. Introduce formulas after the main idea is clear.

The homepages group lessons by topic. Add machine learning models to the existing catalog. Use a new topic section for a different subject when its first lesson is ready.

