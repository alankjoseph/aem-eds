export default function decorate(block) {
    const oldHero = document.querySelector(".hero-image-wrapper");
  if (!oldHero) return;

  // Find the existing wrapper and header (created earlier)
  const wrapperContainer = document.querySelector(".articlecontent");
  const section = wrapperContainer?.querySelector(".article-content-block");
  const header = section?.querySelector(".article-header");

  if (!wrapperContainer || !section || !header) {
    console.warn("Wrapper or header not found. Did you run wrapper and title decorate first?");
    return;
  }

  // Extract caption text
  const caption = oldHero.querySelector("div > div + div")?.innerText.trim() || "";

  // Extract the original <picture>
  const oldPicture = oldHero.querySelector("picture");
  if (!oldPicture) return;

  // Clone the picture and add new class
  const picture = oldPicture.cloneNode(true);
  picture.classList.add("cmp-story-list__img");

  // Build the new photo block
  const photoBlock = document.createElement("div");
  photoBlock.className = "article-header__photo-block article-header__photo-block--normalsize";

  const storyFigure = document.createElement("div");
  storyFigure.className = "cmp-story-figure";

  const figure = document.createElement("figure");
  figure.className = "cmp-story-figure__in";

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "cmp-story-figure__image";

  const webImage = document.createElement("div");
  webImage.className = "cmp-story-figure__web-image";

  // Assemble
  webImage.appendChild(picture);
  imageWrapper.appendChild(webImage);
  figure.appendChild(imageWrapper);

  if (caption) {
    const figcaption = document.createElement("figcaption");
    figcaption.className = "cmp-story-figure__caption";
    figcaption.textContent = caption;
    figure.appendChild(figcaption);
  }

  storyFigure.appendChild(figure);
  photoBlock.appendChild(storyFigure);

  // Append the photo block inside .article-header (after the title block)
  header.appendChild(photoBlock);

  // Remove old hero
  oldHero.remove();
}