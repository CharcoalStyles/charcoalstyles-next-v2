---
created: 2024-07-07 19:18:59+10:00
section: blog
tags: [claude-ai, react]
title: Using Claude AI to create an animated list component in React
---

The latest release of [Claude AI](https://www.claude.ai/)'s 3.5 Sonnet model is one of the best general models for code. Added to this, the team have added a feature called Artifacts that shows the complete code that it generates for you and if it's a webpage it'll show you that, too.

---

Not too long after that release, I used it to help with a Vue project I was working on. It was quite helpful and the Artifacts feature was a great help.

Then, the other day I saw on LinkedIn someone who used it to generate a fairly simple one-off app for an event. It spat out some React + TailwindCSS code, then switched over to a fully rendered and interactive version of the page.

I knew I had to test it out.

## The idea and the first result

I've been watching a bit too much of [Hyperplexed](https://www.youtube.com/@Hyperplexed) recently, so I came up with an idea that is simply way too simple to be a video of his.

The idea is to create a component that rendered a list of items that are animated in from left and right alternatively, as the user scrolls down the page. I started with this prompt:

```text type=static
I'm looking for a react and tailwind component that:
* Has an array of objects as a prop
* The objects have a name, url and a url for a picture from unsplash
* Renders the objects in a card, with the picture to the left and name to the right
* As the user scrolls down, the objects move in from left and right alternately.
Can you create me a sample of of this component?
```

And I got this result below. Note that Claude AI does provide the code as a single file, which is exactly what I've put into the `App.js` file here.

```js type=interactive template=react-tailwind
import React, { useEffect, useRef } from "react";

const AnimatedCardList = ({ items }) => {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {items.map((item, index) => (
        <div
          key={item.name}
          ref={(el) => (cardRefs.current[index] = el)}
          className={`flex items-center mb-4 opacity-0 ${
            index % 2 === 0 ? "-translate-x-full" : "translate-x-full"
          } transition-all duration-500 ease-out`}>
          <img
            src={item.pictureUrl}
            alt={item.name}
            className="w-24 h-24 object-cover rounded-lg mr-4"
          />
          <div>
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline">
              Visit Website
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

// Sample data
const sampleItems = [
  {
    name: "Mountain Vista",
    url: "https://example.com/mountain",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Mountain Vista",
  },
  {
    name: "Coastal Serenity",
    url: "https://example.com/coast",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Coastal Serenity",
  },
  {
    name: "Urban Landscape",
    url: "https://example.com/city",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Urban Landscape",
  },
  {
    name: "Forest Retreat",
    url: "https://example.com/forest",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Forest Retreat",
  },
  {
    name: "Desert Oasis",
    url: "https://example.com/desert",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Desert Oasis",
  },
  {
    name: "Canyon Adventure",
    url: "https://example.com/canyon",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Canyon Adventure",
  },
  {
    name: "Mountain View",
    url: "https://example.com/mountain",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Mountain View",
  },
  {
    name: "Misty Morning",
    url: "https://example.com/mist",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Misty Morning",
  },
  {
    name: "Lakeside Tranquility",
    url: "https://example.com/lake",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Lakeside Tranquility",
  },
  {
    name: "Australian Outback",
    url: "https://example.com/australia",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Australian Outback",
  },
];

// Usage
const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Animated Card List
      </h1>
      <AnimatedCardList items={sampleItems} />
    </div>
  );
};

export default App;
```

Obviously, this sucks. Digging into the code and looking into what is rended using the browser dev tools, I found a few things:

- There is basically no contrast between the text and the background.
- The cards are not visible, there is a tailwind CSS class that makes them invisible put on by default and doesn't have a class that makes them visible.
- While the cards are placed in an alternate left and right position, the mechanism for bringing them in is not there. There is a class that is added to the elements, but it's not a Tailwind class and there's no mention of it in any of the other CSS files.

## The Fixed Version

There's a few quick wins that we can do to make this work.

- Writing the code that makes the cards fly in.
  - Sure the AI gave me a base and gave me the Tailwind classes I needed to make it work, but I did have to write it myself.
- The cards are now visible! The initial styling isn't too bad, not exactly a card, but fine for a list.
- I changed the background color to a dark gray, so things (including the title of the page) could be seen.
- Reducing the size of the area that the list is in, to show the effect better.

```js type=interactive template=react-tailwind height=640px
import React, { useEffect, useRef } from "react";

const AnimatedCardList = ({ items }) => {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const targetClass = entry.target.classList.contains("left")
            ? "translate-x-full"
            : "-translate-x-full";
          if (entry.isIntersecting) {
            console.log("entry", entry);
            entry.target.classList.remove(targetClass);
          } else {
            entry.target.classList.add(targetClass);
          }
        });
      },
      { threshold: 0 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {items.map((item, index) => (
        <div
          className={`flex items-center mb-4 transition-all duration-500 ease-out ${
            index % 2 === 0 ? "left" : "right"
          }`}
          ref={(el) => (cardRefs.current[index] = el)}>
          <Card key={item.name} item={item} />
        </div>
      ))}
    </div>
  );
};

// Sample data
// Note: In a real application, you would fetch these images from the Unsplash API
// using your own access key. The URLs below are placeholders and won't work directly.
const sampleItems = [
  {
    name: "Mountain Vista",
    url: "https://example.com/mountain",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Mountain Vista",
  },
  {
    name: "Coastal Serenity",
    url: "https://example.com/coast",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Coastal Serenity",
  },
  {
    name: "Urban Landscape",
    url: "https://example.com/city",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Urban Landscape",
  },
  {
    name: "Forest Retreat",
    url: "https://example.com/forest",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Forest Retreat",
  },
  {
    name: "Desert Oasis",
    url: "https://example.com/desert",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Desert Oasis",
  },
  {
    name: "Canyon Adventure",
    url: "https://example.com/canyon",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Canyon Adventure",
  },
  {
    name: "Mountain View",
    url: "https://example.com/mountain",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Mountain View",
  },
  {
    name: "Misty Morning",
    url: "https://example.com/mist",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Misty Morning",
  },
  {
    name: "Lakeside Tranquility",
    url: "https://example.com/lake",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Lakeside Tranquility",
  },
  {
    name: "Australian Outback",
    url: "https://example.com/australia",
    pictureUrl: "https://via.placeholder.com/800x600.png?text=Australian Outback",
  },
];

// Card component
const Card = ({ item }) => {
  return (
    <div className="flex items-center">
      <img
        src={item.pictureUrl}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-lg mr-4"
      />
      <div>
        <h2 className="text-xl font-semibold">{item.name}</h2>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline">
          Visit Website
        </a>
      </div>
    </div>
  );
};

// Usage
const App = () => {
  return (
    <div className="bg-gray-800 text-gray-100 min-h-screen py-8">
      <div className="container p-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Animated Card List
        </h1>
        <div className="h-96 w-2/3 bg-gray-900 mx-auto overflow-y-auto overflow-x-hidden">
          <AnimatedCardList items={sampleItems} />
        </div>
      </div>
    </div>
  );
};

export default App;
```

And there you go!

With a bunch of extra work, I think I saved at least 2 minutes making this component.

## Conclusion

Perhaps I was a bit ambitious with this one, but I think it shows that there's some promise there. I definitely found Claude AI to be a bit better than some of the other AIs for code in a chat context and hte Artifacts feature is a great help. But this wasn't a great experience.