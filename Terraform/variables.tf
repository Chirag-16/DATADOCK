variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "domain_name" {
  description = "datadock"
  type        = string
}

variable "ssh_key_name" {
  description = "Name of your AWS key pair"
  type        = string
}