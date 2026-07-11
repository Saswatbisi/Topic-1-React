# Input Variables: Topic 1 - Advanced VPC Networking

variable "aws_region" {
  description = "The target AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "vpc_a_cidr" {
  description = "CIDR block for VPC A (Production)"
  type        = string
  default     = "10.0.0.0/16"
}

variable "vpc_b_cidr" {
  description = "CIDR block for VPC B (Analytics)"
  type        = string
  default     = "10.1.0.0/16"
}
