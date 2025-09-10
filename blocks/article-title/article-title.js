export default function decorate(block) {
  const oldContainer = document.querySelector(".article-title-wrapper");
  if (!oldContainer) return;

  // Extract title text
  const text = oldContainer.innerText.trim();

  // Find the existing wrapper and section (created by the main wrapper decorate)
  const wrapperContainer = document.querySelector(".articlecontent");
  const section = wrapperContainer?.querySelector(".article-content-block");

  if (!wrapperContainer || !section) {
    console.warn("Wrapper not found. Did you run the main wrapper decorate first?");
    return;
  }

  // Build the article-header structure
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

  // Assemble
  titleBlock.appendChild(stampBlock);
  titleBlock.appendChild(h1);
  header.appendChild(titleBlock);
  outerDiv.appendChild(header);

  // Insert into existing section
  section.prepend(outerDiv);

  // Remove old article-title container
  oldContainer.remove();
}
