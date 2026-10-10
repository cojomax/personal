---
role: "Lead IT Developer"
company: "BNP Paribas CIB APAC"
location: "Hong Kong"
period: "Aug 2024 — June 2026"
summary: "Directed the stabilization and rewrite of a BPMN-driven regulatory reporting platform used by BNP staff across
10+ APAC regions. Users design workflows — built from around 80 custom bpmn-js templates — that extract, transform, and
aggregate local financial data into regulatory reports, while also managing and editing large Excel submissions online.
Inherited a fragile, untyped codebase riddled with unhandled exceptions, and led the effort to add proper typing, a real
API layer, coherent error handling, and an event system to make the design module reliable."
tags: ["Angular", "TypeScript", "JavaScript", "Vitest", "AG Grid", "BPMN.io", "Jenkins", "Oracle", "CodeceptJS"]
order: 1
---

### The Goal

Build a platform for internal staff in 10+ APAC regions that helps users design, build, and test workflows that are used
to produce financial regulatory reports.


### My Role
 
Lead developer, working with a team of 2–3 engineers on an Angular frontend used by 50–100 internal staff. 

### The Application

Most modules were concerned with managing financial data for a particular domain. Users could upload large Excel
files, edit them online, and submit changes for approval. These functions were supported by AG Grid (a pleasure to work
with) and NG-ZORRO components. The principal feature, however, was a **workflow designer module**.

#### The Workflow Designer

The designer module allowed users to build workflows that were responsible for extracting, transforming, and aggregating local
financial data to ultimately produce the regulatory reports. The workflows were defined in Business Process Model &
Notation (BPMN) using a JS library, [bpmn-js](https://github.com/bpmn-io/bpmn-js), embedded into the Angular app in the
designer module.

`bpmn-js` is a modeling library suited for customization. We defined approximately 80 custom templates for service tasks
(elements) from which users could choose to build their workflows. These tasks triggered processes such as reading
files, pulling data from our Oracle databases, performing joins and sorts of data, writing data back to files or
databases, and many more.

Workflows were tested in a UAT environment using the frontend execution engine before being approved and submitted for a
production run. The workflows, in the form of `.bpmn` files, were then executed on the
[Camunda](https://docs.camunda.io/) production server.

Since `bpmn-js` (and later the [bpmn-js-token-simulation](https://github.com/bpmn-io/bpmn-js-token-simulation) library)
are modeling and simulation libraries only, we had to build a custom workflow engine that could call out to our backend
APIs to actually execute tasks in a workflow service (Java). The function and performance of the designer module were
the highest priority, so these were the areas on which I focused. 

### The Challenges

Users frequently (read quotidian) reported bugs of varying degrees of severity. Often the bugs were unhandled exceptions
and would therefore completely break the designer module, forcing users to reload or exit their workflows, losing all
progress. Many complaints were about the performance of the designer. None of this was surprising because as I explored
the codebase, I noticed that it had grown without consistent architecture — spaghetti logic, almost no types, no API
layer, duplicated code everywhere, and only rudimentary error handling.

I started with the pleasurable task of refactoring and cleaning up the code: adding an API layer; restructuring files;
creating interfaces and assigning proper types; banning the use of `any` in the project; adding documentation to try to
make sense of the existing code; replacing Karma with Jest (and later Vitest) and writing tests.

The biggest impact, however, came from changes I made that improved the performance and error handling of the
application. I have detailed three of the largest below.

#### Workflow Engine

The original execution engine was slow and inefficient. Almost every service task added to the workflow required some
configuration to know from where its input data should be retrieved and which other tasks would be using the results it
produced. This meant that the workflow — at the time a directed acyclic graph (DAG) — needed frequent traversal (always
starting from the root node) to find source data and know which task could run next. It also meant that workflow
execution had no concurrency, exacerbating the execution time since each service task needed to wait for a response
from the backend before completing and allowing child tasks to execute.

The first step was to implement a traversal function using a depth-first search algorithm that could be used with any
node as an input parameter to find its downstream nodes. This improved searches for target nodes from any one node and
therefore execution time of the whole workflow. This also sped up the time it took to reset the status of every child
task affected by a reset of a single node.

However, this did not solve the problem of concurrency. To improve this, I looked at a few options: writing an entirely
new execution engine with a concurrency mechanism; abandoning execution in the browser and offloading this to a separate
Node.js service (for which existing libraries had been built); or leveraging a new token simulation library that handled
graph traversal (with concurrent tokens built in) but could not execute as an engine should. Considering the effort
required by each and the urgency of the performance requirement, we decided on a combination of the
`bpmn-js-token-simulation` library plus a custom engine that programmatically controlled the execution.

##### Token Simulation Engine

The token simulation library is not an execution engine. It only simulates the traversal of the BPMN graph along its
edges and nodes. This meant that I didn't need to worry about introducing concurrency into the graph traversal since the
library handled this by creating a token context for each new path it encountered.

But I had to control it so that the tokens would stop at each node (service task) and only proceed once the backend
process had been completed and a success response was received. I used the library's APIs to control the token flow and
implemented a custom network request bus with a configurable concurrency limit. The bus would accept deferred `RxJS`
observables into a queue and subscribe to them up to the limit, popping observables from the queue.

With the bus in place, the designer had built-in concurrency and efficient graph traversal. Workflow execution time
dropped by up to 25%. Taking full advantage of the new engine was then up to the business analysts (BAs), who needed to
redesign their workflows with multiple parallel execution paths.

#### Properties Panel

Our `bpmn-js` modeler object imported an additional module, the
[bpmn-js-properties-panel](https://github.com/bpmn-io/bpmn-js-properties-panel). This panel is an extension for
`bpmn-js` that displays properties for any BPMN element (including the service tasks) and lets the user edit them. We
also enhanced this by inserting some AG Grid tables that displayed inputs and outputs, and the data produced by the
tasks into the panel.

Rendering this properties panel after clicking on an element would take between 4 and 6 seconds. For a user working on
a workflow with hundreds of tasks, this delay was a huge source of frustration. My first fix replaced a clunky script —
one that copied a hidden, pre-rendered AG Grid into sections of the panel — with a dynamically created Angular component
that hosted the grid and was injected into a placeholder. This satisfied my penchant for clean code and using Angular's
latest official capabilities, but it barely moved the needle. So I turned to profiling.

I created performance and memory profiles for the loading of the properties panel using Chrome's Performance and Memory
developer tools. This helped me identify the section of the panel that was the culprit and pointed me to the JavaScript
code in the `bpmn-js-properties-panel` library that was slowing everything down. This code was responsible for parsing
and rendering [FEEL Expressions](https://docs.camunda.io/docs/components/modeler/feel/what-is-feel/) in the panel's
editor sections, so I started to dig into the Camunda documentation. I realized that a lot of our element templates
defined properties configured to use these FEEL expressions. Since the expression bodies in the elements were always
*stringified* JSON, and often huge, I reckoned that parsing and rendering this content was blocking the main thread
unnecessarily. I removed the FEEL config, which reduced the load time of the properties panel from 4–6 seconds to mere
milliseconds.

#### JSON Parsing Errors

One of the most frequent errors was a failure to successfully parse string content into JSON. The *stringified* JSON was
embedded into `XML` attributes (`.bpmn` files are essentially `XML`), which were read by TS code to load the JSON objects
into memory when the `.bpmn` files were loaded into the designer module. Due to diverse data sources and conventions in
data preparation, the integrity of the JSON and string content format within that JSON could not be guaranteed to be
correct.

Once again, this was a major source of frustration for users because any error encountered when loading the `.bpmn` into
the designer would go unhandled (as mentioned above) and become a blocking issue. My first attempt to resolve this was a
simple `try/catch` block around the parser and a sanitization function for common compatibility issues that I
identified. This worked for a while, but soon new and unexpected character sequences arose. The `try/catch` block caught
the new errors, but since parsing failed, the affected elements loaded without their data.

I went through the Java code that was part of the pipeline for saving and loading the JSON data. After consulting
with members of the backend team, we unraveled the history of the feature and this recurring bug. I discovered a web of
conflicting code between the frontend and backend and insisted on starting from the beginning. Our discussion led us
toward a new, more reliable solution: we removed all sanitization code from the backend and frontend and put all JSON
data into a single `CDATA` tag at the end of the `XML` file. We built a new API with which we saved and retrieved all
JSON data for every BPMN element. Each element had an ID and an I/O identifier, so we just mapped the data to each
element's identifier when saving and loading the data.

This was a classic case of replacing a Band-Aid solution with a more comprehensive, long-term one. These recurring
parsing errors were officially extinct. Problem solved.