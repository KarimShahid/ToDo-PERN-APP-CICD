# ToDo-PERN-APP-CICD

A **ToDo application** built with the **PERN stack** (PostgreSQL, Express, React, Node.js), fully **dockerized** and deployed on **AWS EC2** using **GitHub Actions** and **Terraform**.

---

## Project Overview

This project is a full-stack ToDo application with a **React frontend**, **Node.js/Express backend**, and **PostgreSQL database**. The app allows users to create, read, update, and delete tasks.

The project is designed with **modern DevOps practices**:

- The application is **fully containerized with Docker**, ensuring consistent environments for development and production.
- **Terraform** is used to provision **AWS EC2 infrastructure** automatically.
- **GitHub Actions workflows** manage CI/CD:
  1. **Terraform Backend Setup Workflow**
     - Creates the **S3 remote backend** for Terraform state management.
  2. **Terraform Apply Workflow**
     - Provisions the EC2 instance and networking resources.
  3. **Application Deployment Workflow**
     - Builds Docker images for frontend, backend, and database.
     - Pushes images to a Docker registry.
     - Pulls images and runs containers on the provisioned EC2 instance.
  4. **Terraform Destroy Workflow**
     - Tears down the EC2 infrastructure when no longer needed.

This setup enables **fully automated deployment**, from infrastructure creation to application running on a live server, and ensures a **reproducible and clean environment**.

---

## Key Features & Technologies

- **Frontend:** React.js  
- **Backend:** Node.js, Express  
- **Database:** PostgreSQL  
- **Containerization:** Docker, Docker Compose  
- **Infrastructure:** Terraform (AWS EC2, S3 backend)  
- **CI/CD:** GitHub Actions pipelines for automated deployment and teardown

---

## What’s Implemented

- **Dockerized frontend, backend, and database** for easy deployment and scaling.
- **Terraform-managed AWS EC2 instance** creation and destruction.
- **S3 backend setup** for Terraform state management using `tf-backend-setup.yml`.
- **CI/CD automation:**
  - Infrastructure provisioning (`terraform apply`).
  - Docker build, push, and deployment to EC2.
  - Infrastructure cleanup (`terraform destroy`).
- **Environment-independent deployment**, allowing the same setup to run locally or in production.

