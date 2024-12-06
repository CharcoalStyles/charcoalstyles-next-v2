---
created: 2022-01-19T21:03:31+11:00
title: NextJS and static deploy to S3 and cloudfront
section: blog
tags: [NextJS, AWS, S3, cloudfront, ci-cd]
---

Using [Next.js](https://nextjs.org)'s Static HTML Export and AWS' S3 storage and Cloudfront CDN, you get a great development experience, a fast loading pre-rendered site and all the React stuff you could want.

But there are a few quirks to get it working _just right_.

---

## Create Next.js application

We're not going to do anything fancy here. The next.js community is great and there's a lot of tutorials out there to get you started.

First up, run the Next.js create script:

```shell
npx create-next-app@latest
# or
yarn create next-app
```

This is all we need to do for this tutorial, but if you want, change the contents of `pages/index.js` to make it your own.

## Build and Export

To create the static HTML version of your site, you'l need to build a production version and then export the final static files.

To build the production version:

```shell
npm run build
# or
yarn build
```

After that completes, run the export command:

```shell
npm run export
# or
yarn export
```

There will now be an `out` directory in the project directory. It contains the static version of your site.

Export is considered an advanced feature of Next.js and has some gotchas that you'll need to be aware of if using it with a complex site. Read about them [here](https://nextjs.org/docs/advanced-features/static-html-export#caveats).

## AWS S3

Login to the [AWS Console](https://console.aws.amazon.com/) and navigate to the S3 service. Click on the **Create bucket** button.

Fill in the bucket name, change the AWS Region if you like and then scroll to the bottom and click on the **Create bucket** button.
  
Open your bucket and click on the **Properties** tab. In here, scroll to the bottom and click on the **Edit** button in the _Static website hosting_ section. Change the _Static website hosting_ option to _Enable_, then change the _Index document_ to `index.html`. Scroll to the bottom and click on the **Save changes** button.

Click on the **Permissions** tab. In here, click on the **Edit** button in hte _Block public access (bucket settings)_ section. Here you want to uncheck the _Block all public access_ option; it is preferable to be more secure, but this is a simple way of making it work and I can never remember what the right options are 🤣. Click on the **Save Changes** button and enter `confirm` in the popup and press the **Confirm** button.

Still in the **Permissions** tab, click on the **Edit** button in the _Bucket policy_ section. In the _policy_ text box replace the text in there with the following code, changing the resource value for the bucket ARN, which is listed above the text box.

```json type=static
{
 "Version": "2012-10-17",
 "Statement": [
  {
   "Sid": "PublicRead",
   "Effect": "Allow",
   "Principal": "*",
   "Action": "s3:GetObject",
   "Resource": "arn:aws:s3:::your-bucket-name/*"
  }
 ]
}
```

Click on the **Save changes** button and your bucket is set up!

## Adding the site to S3

Now to add the files to the bucket and get our first look at the hosted site!

In the AWS S3 console, open the _Objects_ tab and click on the **Upload** button. In here you can drag and drop the contents of the `out` directory in your project's directory. Scroll to the bottom and click on the **Upload** button.

This now shows the progress of the upload. Depending on a bunch of things, this can take a little while. Just be patient.

Once it's finished, click on the **close** button and you'll be back at the _objects_ tab. Time to check out your statically hosted NextJS site! Click on the _Properties_ tab and scroll to the bottom. In the _Static website hosting_ section there will be a URL, click on this and your website will load in a new tab!

## AWS Cloudfront

This is a good start and should be nice and fast. But it can be faster, as well as costing you less if it ever gets a lot of traffic.

Navigate to the CloudFront service and click on the **Create distribution** button. Under the _Origin_ section, set the Origin domain to the domain name of the S3 Static website hosting (everything apart from the `http://` at he start and the slash at the end) and enter a _Name_. then leave all the other options as the defaults and scroll to the bottom and click on the **Create distribution** button.

You'll now be in the distribution's page and under the _Details_ section, the _Last modified_ value should say `deploying`. The deploy takes a few minutes, but eventually the `deploying` will change to a date/time of when you started the creation.

Now you'll be able to visit your site by going to the domain name listed under the _Distribution domain name_ on that page.

Congratulations!

You now have a public website! Between the static deploy from NextJS and the distribution on CloudFront, it should be _lightning fast_ for anyone to see all oer the world.
