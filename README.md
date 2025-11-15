# Fast AI

**Fast AI** is an **AI agent platform** designed to help **preventive healthcare assistant and agent** and to promote public health through its AI integration.

---

## Overview

Its **client persona** focuses on **disease prevention** and **health promotion**, using conversational AI to educate individuals on preventive health measures tailored to their **age**, **lifestyle**, and **risk factors**.

> **Goal:** Prevent the occurrence of diseases and strengthen global preventive care through timely AI-powered insights and alerts.

---

## System Architecture

Fast AI integrates both its **frontend** and **backend** in a project to ensure smooth communication and efficient data tracking.  
The frontend (React) interacts with the backend (Django REST Framework) through REST APIs, and both layers share a unified database for data tracking and prediction.

```text
[Watson-AI-Model] → [Django REST Backend] → [PostgreSQL Database] → [React Frontend UI] → []
```

## Layer stack

| Layer          | Technology                                     |
| -------------- | ---------------------------------------------- |
| **Frontend**   | React, Redux, Chakra UI, Typescript, formik... |
| **Backend**    | Django, Django REST Framework, djoser, jwt...  |
| **Database**   | PostgreSQL...                                  |
| **AI/ML**      | Watsonx Embeding, Watsonx.ai granite model.    |
| **Deployment** | Docker                                         |

## Authors

- Assefa Mekonen
- Ellan Jhonson
- Toyib Bayo

## License

`MIT License`

`Copyright (c) 2025`
