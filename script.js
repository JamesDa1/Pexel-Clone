const imageWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".fa-xmark");
const downloadImgBtn = document.querySelector(".fa-download");

const apiKey = "kCeWMD1nj61FYfaRKNarSKYEWXy6gJvaN3BlhFaD0McYQa0XKlLquzsY";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      // Converting img to blob, creating download link and downloading it
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to download image!"));
};

const showLightBox = (name, img) => {
  // Showing lightbox and adding photographer name and img source
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;

  downloadImgBtn.setAttribute("data-img", img);

  document.body.style.overflow = "hidden";
  lightBox.classList.add("show");
};

const hideLightBox = () => {
  lightBox.classList.remove("show");
  document.body.style.overflow = "auto";
};

const generateHTML = (images) => {
  imageWrapper.innerHTML += images
    .map(
      (img) =>
        `<li onclick="showLightBox('${img.photographer}', '${img.src.large2x}')" class="card" >
        <img src="${img.src.large2x}" alt="img" />
        <div class="details">
          <div class="photographer">
            <i class="fa-solid fa-camera"></i>
            <span>${img.photographer}</span>
          </div>

          <button onclick="event.stopPropagation(); downloadImg('${img.src.large2x}');">
            <i class="fa-solid fa-download"></i>
          </button>
        </div>
      </li>`
    )
    .join("");
};

const getImages = (apiURL) => {
  loadMoreBtn.innerText = "Loading...";
  loadMoreBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      generateHTML(data.photos);
      loadMoreBtn.innerText = "Load More";
      loadMoreBtn.classList.remove("disabled");
    })
    .catch(() => alert("Failed to load images!"));
};

const loadSearchImages = (e) => {
  if (e.target.value === "") return (searchTerm = null);
  if (e.key === "Enter") {
    currentPage = 1;
    searchTerm = e.target.value;
    imageWrapper.innerHTML = "";
    let apiURL = `https://api.pexels.com/v1/search?query=${searchTerm}&${currentPage}&per_page=${perPage}`;

    getImages(apiURL);
  }
};

const loadMoreImages = () => {
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;

  apiURL = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&${currentPage}&per_page=${perPage}`
    : apiURL;
  getImages(apiURL);
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightBox);
downloadImgBtn.addEventListener("click", (e) => {
  downloadImg(e.target.dataset.img);
});
