export default function decorate(block) {
  const oldPage = document.querySelector(".article-page");
  if (!oldPage) return;

  // Create wrapper
  const wrapperContainer = document.createElement("div");
  wrapperContainer.className = "articlecontent";

  const section = document.createElement("section");
  section.className = "article-content-block";
  wrapperContainer.appendChild(section);

  // ----- Build article header -----
  const oldTitle = document.querySelector(".article-title");
  if (oldTitle) {
    const text = oldTitle.innerText.trim();

    const outerDiv = document.createElement("div");
    const header = document.createElement("div");
    header.className = "article-header";

    const titleBlock = document.createElement("div");
    titleBlock.className = "article-header__title-block";

    const stampBlock = document.createElement("div");
    stampBlock.className = "article-header__stamp-block";

    const h1 = document.createElement("h1");
    h1.className = "article-header__title";
    h1.textContent = text;

    titleBlock.appendChild(stampBlock);
    titleBlock.appendChild(h1);
    header.appendChild(titleBlock);
    outerDiv.appendChild(header);
    section.appendChild(outerDiv);

    oldTitle.remove();
  }

  // ----- Build article body -----
  const oldBody = document.querySelector(".default-content-wrapper");
  if (oldBody) {
    const articleBody = document.createElement("div");
    articleBody.className = "article-body";

    const articleIn = document.createElement("div");
    articleIn.className = "article-body__in";

    const articleContent = document.createElement("div");
    articleContent.className = "article-body__content";

    const mmColBlk = document.createElement("div");
    mmColBlk.className = "mm-col-blk__in";

    const contentTop = document.createElement("div");
    contentTop.className = "article-body__content-top";

    const rte = document.createElement("div");
    rte.className = "rtearticle text";

    // Move all <p> from old wrapper
    while (oldBody.firstChild) {
      rte.appendChild(oldBody.firstChild);
    }

    contentTop.appendChild(rte);
    mmColBlk.appendChild(contentTop);
    articleContent.appendChild(mmColBlk);
    articleIn.appendChild(articleContent);
    articleBody.appendChild(articleIn);

    section.appendChild(articleBody);

    oldBody.remove();
  }

  // Replace oldPage with wrapperContainer
  oldPage.replaceWith(wrapperContainer);
}
