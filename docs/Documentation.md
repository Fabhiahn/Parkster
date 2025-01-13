# Documentation

## Overview
This document outlines the technical setup and processes used in the application, including logging, deployment pipelines, containerization, and orchestration.

---
## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technologies Used](#technologies-used)
3. [Deployment Process](#deployment-process)
4. [Logging with Fluentd](#logging-with-fluentd)
5. [Helm Charts for Kubernetes](#helm-charts-for-kubernetes)
6. [CI/CD Pipeline](#ci-cd-pipeline)
7. [Environment Variables](#environment-variables)
8. [Troubleshooting](#troubleshooting)

## Architecture Overview
The application is a microservices-based architecture deployed on a Kubernetes cluster. It includes:
- A **GUI** built with React.
- A **user management service** for handling user-related operations.
- A **parking service** for communication with Amsterdam public API and processing the data.
- Logs collected using **Fluentd** and **Prometheus** and sent to a central log storage.
- Continuous Integration/Continuous Deployment (CI/CD) pipelines powered by **GitHub Actions**.
- Configuration management with **Helm Charts**.

---

## Technologies Used
- **Programming Language**: Python (Flask)
- **Frontend development**: React (JavaScript)
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Logging**: Fluentd
- **Monitoring**: Prometheus
- **Configuration Management**: Helm Charts, k8s secrets for database data

---

## Deployment Process

### 1. **Containerization with Docker**
Each microservice is containerized using Docker. Docker images are built and pushed to Docker Hub using GitHub Actions.

### 2. **Kubernetes Deployment**
The application is deployed to a Kubernetes cluster. Deployments are managed using Helm charts, which streamline the configuration of Kubernetes resources.

### 3. **Helm Chart Directory Structure**
Each Helm chart has two differenet values files, which enable easier differentiation between development and production setup. Each part of the app includes deployment and service part, which should be used together to ensure correct behaviour of the application.

### 4. **Updating Helm Charts**
The Helm chart configuration is updated as part of the CI/CD pipeline.

---

## Logging with Fluentd
### Configuration
Fluentd is used to collect logs from Kubernetes pods.

### Setup
1. Fluentd is deployed as a Helm chart in the Kubernetes cluster.
2. Logs are collected from pod log files (`/var/log/containers`).

### Prometheus
Prometheus collects the data from Fluentd and is able to show it in user friendly way.

---

## CI/CD Pipeline

### Pipeline Overview
The CI/CD pipeline automates the build and deployment processes. It is defined in a GitHub Actions workflow files (`.github/workflows/`). Each part of the application has its own pipeline.

### Steps
1. **Build Docker Images**:
   - Code is checked out and built into Docker images.
   - Images are tagged with the latest commit hash and pushed to Docker Hub.

2. **Deploy to Kubernetes**:
   - The pipeline updates the Helm chart with the new Docker image tag.

---

## Additional information

PostgreSQL database is configured with the backend-secret k8s secret containing the database URI and JWToken secret key. If using on your own cluster you can use your own PostgreSQL database, just store the data in the backend-secrets secret or configure the Helm Chart to your own secret name.
