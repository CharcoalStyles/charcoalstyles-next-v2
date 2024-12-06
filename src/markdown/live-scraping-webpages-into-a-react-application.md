---
created: 2022-02-28T09:38:23+11:00
title: Live scraping webpages
section: blog
tags: [JavaScript, terrible-idea]
---

Recently I was working on a project where we wanted to bring in data from a SharePoint site. Unfortunately because of _reasons_ we didn't have any access to any of the Sharepoint backend. So, I came up with a way of scraping that data live. Use this sparingly, if at all; it's a terrible way of doing this stuff. But if you need to, here's how to do it.

---

## Get the page

This first thing we need to do is grab the actual webpage. For this example, we'll use [a sample site](https://web-scraper-source.vercel.app/). In this sample we bring in Axios, setup a little logging function, then use Axios to download the site and put it's contents in the webpage.

```js type=interactive template=vanilla dependency=axios
import "./styles.css";
import axios from "axios";

const app = document.getElementById("app");

const sections = [];

const appendSection = (newSection) => {
  app.innerHTML = "";
  sections.push(newSection);
  sections.forEach((element) => {
    const d = document.createElement("div");
    d.innerText = element;
    app.appendChild(d);
  });
};
appendSection("Loading...");

axios.get("https://web-scraper-source.vercel.app/").then(({ data }) => {
  appendSection("Loaded");
  appendSection(data);
});
```

## Parse the data

In this site, I list some JS libraries (As provided by [github Copilot](https://copilot.github.com/)) and their last month's downloads. These are contained in a `<div>` with an `id="jsLibraries"`. We can use the `DOMParser` interface to take the returned website's HTML and turn it into a _real_ DOM, then use normal DOM manipulation to get the data.

```js type=interactive template=vanilla dependency=axios
import "./styles.css";
import axios from "axios";

const app = document.getElementById("app");

const sections = [];

const appendSection = (newSection) => {
  app.innerHTML = "";
  sections.push(newSection);
  sections.forEach((element) => {
    const d = document.createElement("div");
    d.innerText = element;
    app.appendChild(d);
  });
};
appendSection("Loading...");

const getDataFromLibrary = (library) => {
  const link = Array.from(library.getElementsByTagName("a"))[0];
  const title = link.innerText;
  const url = link.href;
  const downloads = Array.from(library.getElementsByTagName("span"))[0]
    .innerText;
  return {
    title,
    url,
    downloads,
  };
};

axios.get("https://web-scraper-source.vercel.app/").then(({ data }) => {
  appendSection("Loaded");

  const doc = new DOMParser().parseFromString(data, "text/html");
  const libraries = Array.from(
    doc.getElementById("jsLibraries").getElementsByTagName("div")
  );

  libraries.forEach((l) => {
    const libData = getDataFromLibrary(l);
    appendSection(
      `${Object.keys(libData)
        .map((k) => `${k}: ${libData[k]}`)
        .join("\n")}\n\n`
    );
  });
});
```

## Use the data

So now we've got the page scraped and extracted the data, we can do **stuff** with it. As a little sample, I take the data and re-order it based on the monthly downloads.

```js type=interactive template=vanilla dependency=axios
import "./styles.css";
import axios from "axios";

const app = document.getElementById("app");

const loading = document.createElement("div");
loading.textContent = "Loading";
app.appendChild(loading);

const getDataFromLibrary = (library) => {
  const link = Array.from(library.getElementsByTagName("a"))[0];
  const title = link.innerText;
  const url = link.href;
  const downloads = Array.from(library.getElementsByTagName("span"))[0]
    .innerText;
  return {
    title,
    url,
    downloads,
  };
};

const renderData = (libData, ascending) => {
  const sorted = libData.sort((a, b) => {
    const aa = parseInt(a.downloads);
    const bb = parseInt(b.downloads);
    const r = ascending ? aa - bb : bb - aa;
    return r;
  });

  loading.innerHTML = `
  <h1>Selected JS Libraries</h1>
  <h3>Ordered by monthly downloads, ascending</h3>
  ${sorted
    .map(
      (l) => `<div style="border: solid 1px #333; margin-bottom: 1em;">
        <div style="margin: 0.5em;">
          <a href="${l.url}">${l.title}</a>
          <p>Downloads: ${l.downloads}</p>
        </div>
      </div>`
    )
    .join("")}
  `;
};

axios.get("https://web-scraper-source.vercel.app/").then(({ data }) => {
  const doc = new DOMParser().parseFromString(data, "text/html");
  const libraries = Array.from(
    doc.getElementById("jsLibraries").getElementsByTagName("div")
  );

  const libData = libraries.map((l) => getDataFromLibrary(l));
  renderData(libData, true);
});
```
