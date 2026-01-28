# Terraform-CICD

This repository provides a **Terraform-based Infrastructure as Code (IaC) setup** integrated with **CI/CD workflows** using GitHub Actions. It allows you to provision AWS infrastructure, manage Terraform state remotely, and automate deployment and destruction processes.

---

## Repository Structure

```
.
├── backend-setup           # Terraform code to configure remote backend (S3 + DynamoDB)
├── modules                 # Reusable Terraform modules
│   ├── ec2                 # EC2 instances module
│   ├── sg                  # Security Groups module
│   └── vpc                 # VPC networking module
├── workflows               # GitHub Actions CI/CD pipelines
├── backend.tf              # Backend configuration
├── main.tf                 # Main Terraform configuration
├── outputs.tf              # Terraform outputs
├── providers.tf            # Terraform providers
├── terraform.tfstate       # Terraform state (local copy)
├── terraform.tfvars        # Terraform variables values
├── userdata.sh             # EC2 instance user-data script
├── variables.tf            # Terraform variables
└── versions.tf             # Terraform required version & providers
```

---

## Features

- **Infrastructure Modules**
  - **VPC Module**: Creates custom VPC, subnets, and routing.
  - **EC2 Module**: Launch EC2 instances with custom AMIs and instance types.
  - **Security Group Module**: Configure inbound and outbound rules for EC2 instances.

- **Backend Setup**
  - Configure remote Terraform state using **S3 bucket** and **DynamoDB** for state locking.

- **GitHub Actions Workflows**
  - `tf-backend-setup.yml`: Automates Terraform backend setup.
  - `tf-deploy.yml`: Deploys infrastructure automatically after code changes.
  - `tf-destroy.yml`: Destroys infrastructure safely via CI/CD.

---

## Prerequisites

- Terraform >= 1.5.0
- AWS CLI configured with proper credentials
- GitHub repository for workflows

---

## Usage

### 1. Backend Setup

Before deploying infrastructure, configure the Terraform backend:

```bash
cd backend-setup
terraform init
terraform apply
```

This will create the S3 bucket and DynamoDB table for remote state management.

### 2. Deploy Infrastructure

```bash
terraform init
terraform plan
terraform apply
```

### 3. Destroy Infrastructure

```bash
terraform destroy
```

> **Note:** You can also trigger these actions via the GitHub Actions workflows.

---

## GitHub Actions CI/CD

1. **Backend Setup Workflow** (`tf-backend-setup.yml`)
   - Initializes Terraform backend automatically.

2. **Deploy Workflow** (`tf-deploy.yml`)
   - Runs `terraform plan` and `terraform apply` on code changes.

3. **Destroy Workflow** (`tf-destroy.yml`)
   - Runs `terraform destroy` safely from GitHub Actions.

---

## Variables

All configurable variables are defined in `variables.tf` and can be overridden in `terraform.tfvars`.  

Example:

```hcl
region        = "us-east-1"
vpc_cidr      = "10.0.0.0/16"
instance_type = "t3.micro"
```

---

## Outputs

Key outputs like EC2 instance IDs, public IPs, and VPC IDs are available via `outputs.tf`.

---

## Contributing

1. Fork the repository.
2. Make changes in a feature branch.
3. Submit a pull request for review.

--

Made with ❤️ by Karim using Terraform

