# 🧠 Fast AI

**Fast AI** is an **AI agent platform** designed to help **preventive healthcare assistant** and to promote public health through its AI integration.

The system leverages pretrained **IBM Watsonx AI Granite model** to give a personalized preventive care advice, additonally it analyze data patterns from various sources and provides **early warnings** to **WHO workers** and other health organizations.

By detecting unusual patterns in health-related data, **Fast AI** aims to reduce the morbidity and mortality from chronic illness, infectious diseases and etc.. and decrease the spread of diseases and save lives through proactive response systems.

---

## 🌍 Overview

Its **client persona** focuses on **disease prevention** and **health promotion**, using conversational AI to educate individuals on preventive health measures tailored to their **age**, **lifestyle**, and **risk factors**.

Additionally, **Fast AI** continuously monitors health data to identify emerging disease patterns and provides **early alerts** to **WHO workers** and other public health organizations.

> ⚕️ **Goal:** Prevent the occurrence of diseases and strengthen global preventive care through timely AI-powered insights and alerts.

---

## 🧩 System Architecture

Fast AI integrates both its **frontend** and **backend** in a project to ensure smooth communication and efficient data tracking.  
The frontend (React) interacts with the backend (Django REST Framework) through REST APIs, and both layers share a unified database for data tracking, prediction, and alert management.

```text
[Data Source] → [Django REST Backend] → [PostgreSQL Database] → [React Frontend UI]
```

### Clone the repository

git clone https://github.com/dailyhealer-dev/Fast-AI.git
`cd Fast-AI`

### Frontend Setup (React)

#### Navigate to the frontend directory

`cd frontend`

#### Install dependencies

`npm install`

#### Run the development server

`npm start`

### Backend Setup (Django REST Framework)

#### Navigate to the backend directory

`cd ../backend`

#### build fastai docker container

`docker compose --build`

#### Up and running docker container, running django models migrations

`docker compose up`

## Layer stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| **Frontend**   | React, Redux, Chakra UI, Typescript, formik...  |
| **Backend**    | Django, Django REST Framework, djoser, jwt...   |
| **Database**   | PostgreSQL...                                   |
| **AI/ML**      | Watsonx.ai Assistant, Watsonx.ai granite model. |
| **Deployment** | Docker, GitHub Actions (CI/CD)                  |
