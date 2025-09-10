// -----------------------------
// Entry Point
// -----------------------------
export async function loadLazy(main) {
	const articleContent = buildArticleContent(main);

	// Move sections into header/body
	distributeSections(main, articleContent);

	// Append new wrapper to main
	main.appendChild(articleContent);

	// Run decoration pipeline
	decorateArticle(articleContent, main);
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

	[...main.querySelectorAll("main > .section")].forEach((section) => {
		if (section.classList.contains("article-content")) {
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

function decorateArticleBody(main) {
	const articleContent = main.querySelector(".section.article-content");
	if (!articleContent) return;

	const defaultContentWrapper = articleContent.querySelector(
		".default-content-wrapper"
	);
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

	defaultContentWrapper.replaceWith(articleBodyIn);
}

function decorateArticleTitle(main) {
	const section = main.querySelector(".section.article-title");
	if (!section) return;

	const defaultContentWrapper = section.querySelector(
		".default-content-wrapper"
	);
	if (!defaultContentWrapper) return;

	const h1Text =
		defaultContentWrapper.querySelector("h1")?.innerText.trim() || "";

	const titleBlock = document.createElement("div");
	titleBlock.className = "article-header__title-block";

	const h1 = document.createElement("h1");
	h1.className = "article-header__title";
	h1.textContent = h1Text;

	titleBlock.appendChild(h1);
	defaultContentWrapper.replaceWith(titleBlock);
}

function decorateHeroImage(main) {
	const section = main.querySelector(".section.hero-image");
	if (!section) return;

	const oldWrapper = section.querySelector(".default-content-wrapper");
	if (!oldWrapper) return;

	// Extract original <picture>
	const picture = oldWrapper.querySelector("picture");
	if (!picture) return;

	// Extract caption <p> (if exists, after picture)
	let captionText = "";
	const paragraphs = oldWrapper.querySelectorAll("p");
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
	oldWrapper.replaceWith(photoBlock);
}
