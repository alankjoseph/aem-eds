export async function loadLazy(main) {
  const articleContent = document.createElement("div");
  articleContent.className = "articlecontent";

  const articleContentBlock = document.createElement("section");
  articleContentBlock.className = "article-content-block";
  articleContent.appendChild(articleContentBlock);

  const articleHeader = document.createElement("div");
  articleHeader.className = "article-header";
  articleContentBlock.appendChild(articleHeader);

  const articleBody = document.createElement("div");
  articleBody.className = "article-body";
  articleContentBlock.appendChild(articleBody);

  [...main.querySelectorAll("main > .section")].forEach((section) => {
    if (section.classList.contains("article-content")) {
      articleBody.appendChild(section);
    } else {
      articleHeader.appendChild(section);
    }
  });

  main.appendChild(articleContent);

  decorateArticleHeaderBlock(main);
  decorateArticleBodyBlock(main);
}

function decorateArticleHeaderBlock(main) {
  const articleHeader = document.querySelector(".article-header");
  if (!articleHeader) return;

  decorateArticleTitleBlock(main);
  decorateHeroImageBlock(main);
}

function decorateArticleBodyBlock(main) {
   const sections = main.querySelectorAll(".section.article-content");
  sections.forEach((section) => {
    const oldWrapper = section.querySelector(".default-content-wrapper");
    if (!oldWrapper) return;

    // Grab inner content of old wrapper
    const contentHTML = oldWrapper.innerHTML;

    // Build new nested structure
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
      </div>
    `;

    // Replace only the .default-content-wrapper
    oldWrapper.replaceWith(articleBodyIn);
  });
}

function decorateArticleTitleBlock(main) {
  const section = document.querySelector(".section.article-title");

  if (section) {
    const oldWrapper = section.querySelector(".default-content-wrapper");
    if (!oldWrapper) return;

    const h1Text = oldWrapper.querySelector("h1")?.innerText.trim() || "";

    // Build new structure
    const titleBlock = document.createElement("div");
    titleBlock.className = "article-header__title-block";

    const h1 = document.createElement("h1");
    h1.className = "article-header__title";
    h1.textContent = h1Text;

    titleBlock.appendChild(h1);

    // Replace only the inner wrapper
    oldWrapper.replaceWith(titleBlock);
  }
}

function decorateHeroImageBlock(main) {
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

