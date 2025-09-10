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

	const defaultContentWrapper = articleContent.querySelector(".default-content-wrapper");
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

	const defaultContentWrapper = section.querySelector(".default-content-wrapper");
	if (!defaultContentWrapper) return;

	const h1Text = defaultContentWrapper.querySelector("h1")?.innerText.trim() || "";

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

	const defaultContentWrapper = section.querySelector(".default-content-wrapper");
	if (!defaultContentWrapper) return;

	const picture = defaultContentWrapper.querySelector("picture");
	if (!picture) return;

	// grab caption dynamically
	const caption = [...defaultContentWrapper.querySelectorAll("p")]
		.map((p) => p.innerText.trim())
		.filter(Boolean)[1]; // 2nd <p> if exists

	const photoBlock = document.createElement("div");
	photoBlock.className =
		"article-header__photo-block article-header__photo-block--normalsize";

	const cmpStoryFigure = document.createElement("div");
	cmpStoryFigure.className = "cmp-story-figure";

	const figure = document.createElement("figure");
	figure.className = "cmp-story-figure__in";

	const imageWrapper = document.createElement("div");
	imageWrapper.className = "cmp-story-figure__image";

	const webImage = document.createElement("div");
	webImage.className = "cmp-story-figure__web-image";

	picture.classList.add("cmp-story-list__img");
	webImage.appendChild(picture);
	imageWrapper.appendChild(webImage);
	figure.appendChild(imageWrapper);

	if (caption) {
		const figcaption = document.createElement("figcaption");
		figcaption.className = "cmp-story-figure__caption";
		figcaption.textContent = caption;
		figure.appendChild(figcaption);
	}

	cmpStoryFigure.appendChild(figure);
	photoBlock.appendChild(cmpStoryFigure);

	defaultContentWrapper.replaceWith(photoBlock);
}
