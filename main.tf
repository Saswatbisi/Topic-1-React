# Terraform Configuration: Topic 1 - Advanced VPC Networking

provider "aws" {
  region = var.aws_region
}

# 1. VPC A & VPC B Definitions
resource "aws_vpc" "vpc_a" {
  cidr_block           = var.vpc_a_cidr
  enable_dns_hostnames = true
  tags = { Name = "VPC-A-Production" }
}

resource "aws_vpc" "vpc_b" {
  cidr_block           = var.vpc_b_cidr
  enable_dns_hostnames = true
  tags = { Name = "VPC-B-Analytics" }
}

# 2. Subnet Definitions (Public and Private for VPC A)
resource "aws_subnet" "vpc_a_public" {
  vpc_id                  = aws_vpc.vpc_a.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true
  tags = { Name = "VPC-A-Public-Subnet" }
}

resource "aws_subnet" "vpc_a_private" {
  vpc_id            = aws_vpc.vpc_a.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.aws_region}a"
  tags = { Name = "VPC-A-Private-Subnet" }
}

# 3. NAT Gateway & Elastic IP (EIP)
resource "aws_eip" "nat_eip" {
  domain = "vpc"
  tags   = { Name = "NAT-Gateway-EIP" }
}

resource "aws_nat_gateway" "nat_gw" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.vpc_a_public.id
  tags          = { Name = "VPC-A-NAT-Gateway" }
}

# 4. VPC Peering Connection
resource "aws_vpc_peering_connection" "peering_a_b" {
  peer_vpc_id = aws_vpc.vpc_b.id
  vpc_id      = aws_vpc.vpc_a.id
  auto_accept = true
  tags        = { Name = "Peering-VPC-A-to-VPC-B" }
}

# 5. AWS Transit Gateway (TGW) Hub
resource "aws_ec2_transit_gateway" "tgw" {
  description     = "Production Transit Gateway Hub"
  dns_support     = "enable"
  vpn_ecmp_support = "enable"
  tags            = { Name = "Main-Transit-Gateway" }
}

resource "aws_ec2_transit_gateway_vpc_attachment" "tgw_attach_a" {
  subnet_ids         = [aws_subnet.vpc_a_private.id]
  transit_gateway_id = aws_ec2_transit_gateway.tgw.id
  vpc_id             = aws_vpc.vpc_a.id
}

# 6. VPC Endpoint / PrivateLink interface endpoint
resource "aws_vpc_endpoint" "s3_endpoint" {
  vpc_id            = aws_vpc.vpc_a.id
  service_name      = "com.amazonaws.${var.aws_region}.s3"
  vpc_endpoint_type = "Interface"
  subnet_ids        = [aws_subnet.vpc_a_private.id]
  tags              = { Name = "VPC-A-S3-PrivateLink-Endpoint" }
}
