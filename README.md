# Anquilosaurios - Web Client

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Frontend core for a social, multiplayer web game targeting the Latin American market, built with SvelteKit and integrating Unity WebGL.

This repository contains the frontend application built with SvelteKit. It serves as the user interface and orchestrator for the multiplayer web game, embedding the Unity WebGL game client hosted in a separate repository and communicating with the backend service (built in .NET) through REST API endpoints.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Tools](#tools)
- [Maintainers](#maintainers)
- [License](#license)

## Background

The frontend provides a responsive, lightweight web application optimized for Latin American users with limited hardware and unstable internet connections. It offers UI for authentication, lobby management, game session control, and analytics dashboards while embedding the Unity WebGL game client for immersive multiplayer gameplay.

## Install

This project uses [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/). Clone the repository and install dependencies:

```bash
git clone https://github.com/LePeanutButter/anquilosaurios-web-client.git
cd anquilosaurios-web-client
npm install
```

Run the frontend locally:

```bash
npm run dev
```

The app will be available at **`http://localhost:5173`** (or configured port).

## Usage

The frontend provides:

- User authentication via external .NET backend
- Game lobby browsing and joining
- Embedding and launching the Unity WebGL game client
- Displaying player stats and global leaderboards
- Role-based routing (e.g., admin-only pages)

It communicates with the backend API to manage game sessions and player data. Tokens received after login are securely stored and passed to the Unity WebGL client via `postMessage()` for gameplay authentication.

## Architecture

- **Frontend:** SvelteKit (adapter-static)
- **Game Client:** Unity WebGL embedded via iframe
- **Backend:** ASP.NET Core REST API (external repo)
- **Database:** Azure SQL
- **Deployment:** Azure Static Web Apps
- **Security:** HTTPS, JWT tokens for session auth
- **Tools:** GitHub, Azure DevOps, Miro, Figma

UI designs and user flows are maintained in **Figma**, with system diagrams available in **Miro**.

## Tech Stack

- **Language:** TypeScript
- **Framework:** SvelteKit
- **Auth:** JWT via .NET backend
- **CI/CD:** Azure DevOps Pipelines
- **Cloud:** Azure Static Web Apps

## Tools

| Tool         | Purpose                                      |
|--------------|----------------------------------------------|
| Figma        | Frontend UI/UX design                        |
| Miro         | Business logic and architecture diagrams     |
| Azure        | Cloud deployment and storage                 |
| GitHub       | Version control and collaboration            |
| Azure DevOps | CI/CD pipelines and project tracking         |

## Maintainers

- [Lanapequin](https://github.com/Lanapequin) - Laura Natalia Perilla Quintero  
- [LePeanutButter](https://github.com/LePeanutButter) - Santiago Botero Garcia  
- [shiro](https://github.com/JoseDavidCastillo) - Jose David Castillo Rodriguez


## License
[MIT](/LICENSE) © Richard Littauer

This README follows the <u>**Standard Readme**</u> specification.
