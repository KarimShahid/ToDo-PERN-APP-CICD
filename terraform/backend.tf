terraform {
  backend "s3" {
    bucket  = "todoapp-remotebackend-2026"
    key     = "todoapp-CICD/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}