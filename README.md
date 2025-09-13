# Anquilosaurios - Web Client

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Frontend Core for a social, multiplayer web game targeting the Latin American market, built with Blazor and integrating Unity WebGL.

This repository contains the frontend application built with Blazor that serves as the user interface and orchestrator for the multiplayer web game. It integrates the Unity WebGL game client hosted in a separate repository and communicates with the backend service through REST API endpoints.

---

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Integration with Unity WebGL](#integration-with-unity-webgl)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Tools](#tools)
- [Contributing](#contributing)
- [Maintainers](#maintainers)
- [License](#license)

---

## Background

The frontend provides a responsive, lightweight web application optimized for Latin American users with limited hardware and unstable internet connections. It offers UI for authentication, lobby management, game session control, and analytics dashboards while embedding the Unity WebGL game client for immersive multiplayer gameplay.

---

## Install

> Requirements:
> - [.NET 8 SDK](https://dotnet.microsoft.com/)
> - [Git](https://git-scm.com/)

Clone the repository and restore dependencies:

```bash
git clone https://github.com/your-org/multiplayer-webgame-backend.git
cd multiplayer-webgame-backend
dotnet restore
```

Run the frontend locally:

```bash
dotnet run
```


The app will be available at **`https://localhost:5000`** (or configured port).

## Usage

The frontend provides:

- User authentication interface
- Game lobby browsing and joining
- Embedding and launching the Unity WebGL game client
- Displaying player stats and global leaderboards

It communicates with the backend API to manage game sessions and player data.

## Integration with Unity WebGL

The Unity WebGL build is hosted in a separate repository but integrated into this Blazor app via an <iframe> or WebGL loader script.

This allows seamless gameplay experience embedded within the Blazor UI.

The frontend manages loading, error handling, and state synchronization with the backend API during gameplay.

Future versions plan to enhance real-time communication with WebSockets or SignalR for smoother multiplayer interaction.

## Architecture

- **Frontend:** Blazor WebAssembly
- **Game Client:** Unity WebGL embedded in the frontend
- **Backend:** ASP.NET Core REST API
- **Database:** Azure SQL + MongoDB
- **Deployment:** Azure App Services
- **Security:** HTTPS, JWT tokens for session auth
- **Tools:** GitHub, Azure DevOps, Miro, Figma

UI designs and user flows are maintained in **Figma** with system diagrams available in **Miro**.

## Tech Stack

- **Language:** C#
- **Framework:** ASP.NET Core
- **Database:** Planned - Azure SQL + MongoDB
- **Auth:** JWT (planned)
- **CI/CD:** Azure DevOps Pipelines
- **Cloud:** Azure App Services (planned)
- **Monitoring:** To be defined (App Insights / others)

## Tools

| Tool         | Purpose                                      |
|--------------|----------------------------------------------|
| Figma        | Frontend UI/UX design                        |
| Miro         | Business logic and architecture diagrams     |
| Azure        | Cloud deployment and storage                 |
| GitHub       | Version control and collaboration            |
| Azure DevOps | CI/CD pipelines and project tracking         |

## Contributing

We welcome contributions from developers familiar with **.NET**, **Azure**, or **backend design**. To contribute:

1. Fork the repository

2. Create a new branch:

```bash
git checkout -b feature/my-feature
```

3. Commit your changes:

```bash
git commit -am 'Add new feature'
```

4. Push to the branch:

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

Please make sure to follow coding best practices and write **unit tests** for your changes.

## Maintainers

- [Lanapequin](https://github.com/Lanapequin) - Laura Natalia Perilla Quintero
- [LePeanutButter](https://github.com/LePeanutButter) - Santiago Botero Garcia
- [shiro](https://github.com/JoseDavidCastillo) - Jose David Castillo Rodriguez

## License

MIT

This README follows the <u>**Standard Readme**</u> specification.