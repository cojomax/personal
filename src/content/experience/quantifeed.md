---
role: "Senior Software Engineer"
company: "Quantifeed HK Ltd"
location: "Hong Kong"
period: "Mar 2019 — Aug 2024"
order: 2
hasWriteUp: true
summary: "Developed and maintained a white-labelled portfolio management and administration application, building
reusable components and services for the shared Angular library that powered every client deployment. Added a
configurable content security policy middleware to the ASP.NET Core backend and integrated direct debit authorization
into the mobile app, while also helping shape product direction."
tags: ["TypeScript", "C#", "Angular", "JavaScript", ".NET Core", "SQL Server", "Microsoft Azure", "Azure DevOps", "Docker"]
---

### My Role

I joined as an intermediate engineer and grew into a senior one, helping shape product direction and engineering
standards for a team of 10+ developers across multiple applications and 15+ clients.

### The Migration

I joined Quantifeed while it was still a start-up. We had one customer-facing trading application that provided
investment research and advised customers on model portfolios, rebalancing them according to quantitative research
outcomes. As a new joiner, I was handed the task of migrating the entire app from AngularJS to Angular 7. I would be
doing this by myself, and at this point my experience with Angular had been brief, so I had to quickly learn on the
job.

The team had been working on a web library, building components and services that could be shared by different apps.
Hence, my approach was to tackle each page, one by one, making use of existing services and components where possible,
and adding the new components and services I wrote for the migrated app to the library.

The most obvious challenge with this task was learning two very different frameworks at the same time. Angular 2+ is a
very different framework to AngularJS: the architecture is different, as are dependency injection and change detection.
Not to mention, one is plain JavaScript and the other is TypeScript.

In addition to a phased migration, which needed to be tested with the Karma testing framework, I was also required
to maintain the existing AngularJS app: fix any production bugs and make changes requested by clients.

This phase took about a year. Overall, it was a smooth migration. The new app was released with minimal issues and some
new features. I had migrated roughly 10 substantial modules (pages), some with critical trading capabilities. My
technical and domain knowledge had grown during this time, and when we finally decommissioned the old app and
released the upgraded version, I was ready to exercise this knowledge in another application.

### The Platform

By the time I had finished the migration and was ready to "join" the rest of the team, the client base had grown, and we
were working on a few different applications: the customer app I had migrated, which focused on building model
portfolios around investment themes; an investment app that used a wizard to choose model portfolios based on the user's
selection of a long-term goal; a customer-facing mobile application where users could invest in model portfolios; and a
newer portfolio management and administration application that was used by portfolio managers to build portfolios,
onboard and manage client accounts, track orders and trades, rebalance portfolios, etc.

All of these applications were supported by our internal library of components and services. Whatever could be shared
was put into the library. Library components were thus heavily customizable to accommodate clients' needs. We also made
this library available to clients that wanted to build their own applications, which means that every shared component
had to be carefully tested, documented and easy to use.

We served multiple tenants and built this white-labeled app to serve 15+ clients. Of course, this came with an added
task of managing client configurations in the .NET web server and the Angular app. We configured branding in the Angular
app and configured domain data and app subscriptions on the web server, which was included in downstream requests to our
backend services.

### Content Security Policy

I was asked to add a content security policy (CSP) to our web servers to improve the security of the apps. This would
only allow resources to load or run from sources that we trusted. Since our applications communicated only with our own
web server, I added a restrictive default-deny CSP header to the response returned by our web app. However, the policy
also needed to be configurable, since some clients requested to have their own scripts (like those provided by Google
Tag Manager) run on their apps and some would have images loaded from their own servers.

With our existing, extensive configuration capability, this came down to middleware that merged client policy directives
with the base one. This added a crucial layer of security to our web app.
 
### Direct Debit Authorization

I was assigned to enhance the direct debit authorization (DDA) feature that we had added to our mobile application.
It only supported a DDA setup with one financial institution, and we needed to add the capability to facilitate setup
with other institutions. The initial implementation had focused on one client, so we would need to refactor this so that
we could add more clients via configuration changes only.

This was a full-stack feature: I needed to integrate into the existing feature by adding new screens to the frontend and
new APIs and services to the web server. Although we would accommodate multiple institutions, they all adhered to the
same protocol to receive data and would all respond with the same structure. We captured information from the user in
our mobile app, sent the data to our web server using the new endpoints, validated and transformed the data, and
submitted it in a form to the external API.

The external system used a Windows variant of a Japanese character encoding, Shift JIS, and required a fixed-width
format where each field value occupied a fixed number of bytes, sometimes using full-width/double-byte characters. I
needed to validate the byte size using the matching code page and pad or truncate the values if they did not match
exactly.

Testing with an actual system was tricky because we had to pay for a small window of access each time. I relied on
sample requests and responses from the client to write NUnit tests and did actual integration testing towards the end
once the full feature was ready. After a couple of rounds, the integration tests passed, and this feature was released
into production, fully capable of setting up DDAs for all clients.