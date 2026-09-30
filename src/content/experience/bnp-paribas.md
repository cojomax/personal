---
role: "Lead IT Developer"
company: "BNP Paribas CIB APAC"
location: "Hong Kong"
period: "Aug 2024 — June 2026"
tags: ["TypeScript", "Angular", "JavaScript", "Vitest", "AG Grid", "BPMN.io", "Jenkins", "Oracle", "CodeceptJS"]
order: 1
---

#### The Vision

One custom platform that can be used by BNP staff in 10+ APAC regions to produce regulatory financial reports. 

#### The Mission

Build an internal tool that helps users build workflows, manage regulatory reports and files, edit Excel files online,
and trigger or schedule report generation.

#### The Application

An Angular application that used AG Grid and NG-ZORRO UI components.

Most modules/pages allowed users to manage large Excel files that contained raw domain data that was ultimately used to
produce regulatory reports. Users could upload files, edit them online, and submit them for approval. Each new
submission created a new version of the file.

The principal feature was a **workflow design module**, which allowed users to build workflows that were
responsible for extracting, transforming, and aggregating local financial data to ultimately produce the regulatory
reports. The workflows were defined using Business Process Model & Notation (BPMN), which was facilitated by a JS
library, [bpmn-js](https://github.com/bpmn-io/bpmn-js), embedded into the Angular app in the Design module.

`bpmn-js` is a modeling library suited for customization. We defined approximately 80 custom templates from which users
could choose to build their workflows. The templates performed tasks like reading files, pulling data from Oracle
databases, joining data, selecting and sorting data, etc.

#### The Challenge

Users frequently (read quotidian) reported bugs of varying degrees of severity. Often the bugs were unhandled exceptions
and would therefore completely break the design module, forcing users to reload or exit their workflows, losing all
progress. 

My mandate was to stabilize the application and build an event system for the Design module.

Upon inspection, I noticed many architectural and maintainability issues, of which the most salient were:
- A missing API layer.
- No coherent file or code structure.
- Almost no defined types (I saw `any` used everywhere).
- Inexperienced usage of RxJS.
- The opposite of clean code (spaghetti code, duplications everywhere, mixed responsibilities).
- Central error handling.
