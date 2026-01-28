module "vpc" {
  source = "./modules/vpc"

  environment = var.environment
  vpc_cidr    = var.vpc_cidr
  tags        = var.tags
}


module "sg" {
  source = "./modules/sg"

  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  ssh_allowed_cidr   = var.ssh_allowed_cidr
  to_port            = var.to_port
  from_port          = var.from_port
  protocol           = var.protocol
  tags               = var.tags
}

module "ec2" {
  source = "./modules/ec2"
  
  environment = var.environment
  key_name   = var.key_name
  subnet_id  = module.vpc.public_subnet_ids[0]
  sg_id      = module.sg.security_group_id
  tags       = var.tags
  user_data  = file("${path.module}/userdata.sh")
}