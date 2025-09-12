import { getMetadata, loadCSS } from "../../scripts/aem.js";

import { getSectionPath, getSubSectionPath } from "../../scripts/common.js";
function getArticleByMetadata() {
  return {
    path: window.location.pathname,
    section: getMetadata("section"),
    subSsection: getMetadata("sub-section"),
  };
}

export async function loadEager(main) {
  const article = getArticleByMetadata();
  const breadCrumb = buildBreadCrumb(article);
  const articleContent = buildArticleContent(main);

  // Move sections into header/
  distributeSections(main, articleContent);

  // Append new wrapper to main
  main.appendChild(breadCrumb);
  main.appendChild(articleContent);

  // Run decoration pipeline
  decorateArticle(articleContent, main);
}

export async function loadLazy(main) {
  loadCSS(`${window.hlx.codeBasePath}/styles/slick.min.css`)
  loadCSS(`${window.hlx.codeBasePath}/templates/article/article.css`);
}

function buildBreadCrumb(article) {
  const sectionName = article.section;
  const subSectionName = article.subSsection;
  const sectionPath = getSectionPath(article.path);
  const subSectionPath = getSubSectionPath(article.path);

  if (!sectionName) return null;

  // Outer container
  const container = document.createElement("div");
  container.className = "container";

  // Section wrapper
  const section = document.createElement("section");
  section.className = "section-wrapper pb-0";

  // Breadcrumb wrapper
  const breadcrumb = document.createElement("div");
  breadcrumb.className = "comp-header__breadcrumb";

  // List
  const ul = document.createElement("ul");

  // Section item
  const liSection = document.createElement("li");
  const aSection = document.createElement("a");
  aSection.href = sectionPath;
  aSection.title = sectionName;
  aSection.textContent = sectionName;
  liSection.appendChild(aSection);
  ul.appendChild(liSection);

  // Sub-section item (only if available)
  if (subSectionName) {
    const liSub = document.createElement("li");
    const aSub = document.createElement("a");
    aSub.href = subSectionPath;
    aSub.title = subSectionName;
    aSub.textContent = subSectionName;
    liSub.appendChild(aSub);
    ul.appendChild(liSub);
  }

  // Assemble
  breadcrumb.appendChild(ul);
  section.appendChild(breadcrumb);
  container.appendChild(section);

  return container;
}

// -----------------------------
// Build main structure
// -----------------------------
function buildArticleContent() {
  const articleContent = document.createElement("div");
  articleContent.className = "articlecontent";

  const articleContentBlock = document.createElement("section");
  articleContentBlock.className = "article-content-block";

  const articleHeader = document.createElement("div");
  articleHeader.className = "article-header";

  const articleBody = document.createElement("div");
  articleBody.className = "article-body";

  articleContentBlock.append(articleHeader, articleBody);
  articleContent.appendChild(articleContentBlock);

  return articleContent;
}

// -----------------------------
// Place sections into header/body
// -----------------------------
function distributeSections(main, articleContent) {
  const articleHeader = articleContent.querySelector(".article-header");
  const articleBody = articleContent.querySelector(".article-body");

  const sections = [...main.querySelectorAll("main > .section")];

  sections.forEach((section, index) => {
    const isLast = index === sections.length - 1;

    if (isLast) {
      // always push last section into body
      articleBody.appendChild(section);
    } else {
      articleHeader.appendChild(section);
    }
  });
}

// -----------------------------
// Decoration Pipeline
// -----------------------------
function decorateArticle(articleContent, main) {
  decorateArticleHeader(articleContent, main);
  decorateArticleBody(main);
}

function decorateArticleHeader(articleContent, main) {
  const articleHeader = articleContent.querySelector(".article-header");
  if (!articleHeader) return;

  decorateArticleTitle(main);
  decorateHeroImage(main);
}

function decorateArticleTitle(main) {
  const defaultContentWrapper = document.querySelector(
    ".section .default-content-wrapper"
  );
  if (!defaultContentWrapper) return;

  // Create new wrapper
  const newDiv = document.createElement("div");
  newDiv.className = "article-header__title-block";

  // Create new h1
  const newH1 = document.createElement("h1");
  newH1.className = "article-header__title";
  newH1.textContent = defaultContentWrapper.textContent; // keep the same text

  // Append h1 to new div
  newDiv.appendChild(newH1);

  // Replace old parent with new structure
  defaultContentWrapper.parentElement.replaceWith(newDiv);
}

function decorateHeroImage(main) {
  const defaultContentWrapper = document.querySelector(
    ".section .default-content-wrapper"
  );
  if (!defaultContentWrapper) return;

  // Extract original <picture>
  const picture = defaultContentWrapper.querySelector("picture");
  if (!picture) return;

  // ✅ Force eager loading on <img> inside <picture>
  const img = picture.querySelector("img");
  if (img) {
    img.setAttribute("loading", "eager");
  }

  // Extract caption <p> (if exists, after picture)
  let captionText = "";
  const paragraphs = defaultContentWrapper.querySelectorAll("p");
  if (paragraphs.length > 1) {
    captionText = paragraphs[1].innerText.trim();
  }

  // Build new structure
  const photoBlock = document.createElement("div");
  photoBlock.className =
    "article-header__photo-block article-header__photo-block--normalsize";

  const figure = document.createElement("figure");
  figure.className = "cmp-story-figure__in";

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "cmp-story-figure__image";

  const webImage = document.createElement("div");
  webImage.className = "cmp-story-figure__web-image";

  // Move original picture into new structure
  picture.classList.add("cmp-story-list__img");
  webImage.appendChild(picture);
  imageWrapper.appendChild(webImage);

  // Caption (dynamic from <p>)
  if (captionText) {
    const caption = document.createElement("figcaption");
    caption.className = "cmp-story-figure__caption";
    caption.textContent = captionText;
    figure.appendChild(imageWrapper);
    figure.appendChild(caption);
  } else {
    figure.appendChild(imageWrapper);
  }

  const cmpStoryFigure = document.createElement("div");
  cmpStoryFigure.className = "cmp-story-figure";
  cmpStoryFigure.appendChild(figure);

  photoBlock.appendChild(cmpStoryFigure);

  // Replace old wrapper with new block
  defaultContentWrapper.parentElement.replaceWith(photoBlock);
}

function decorateArticleBody(main) {

  document
    .querySelectorAll(".article-body > .section > .default-content-wrapper")
    .forEach((wrapper) => {
      // Move all children of the wrapper before the wrapper
      while (wrapper.firstChild) {
        wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
      }
      // Remove the empty wrapper itself
      wrapper.remove();
    });

  const defaultContentWrapper = main.querySelector(".article-body .section");
  if (!defaultContentWrapper) return;

  const contentHTML = defaultContentWrapper.innerHTML;
  const articleBodyIn = document.createElement("div");
  articleBodyIn.className = "article-body__in";
  articleBodyIn.innerHTML = `
    <div class="article-body__content">
      <div class="mm-col-blk__in">
        <div class="article-body__content-top">
          <div class="rtearticle text">
            ${contentHTML}
          </div>
        </div>
      </div>
    </div>`;

  defaultContentWrapper.replaceChildren(articleBodyIn);
}
