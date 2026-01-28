terraform {
  backend "s3" {
    bucket         = "todoapp-remote-backend-2026" 
    key            = "todoapp-CICD/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
  }
}