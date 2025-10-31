output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.web_server.public_ip
}

output "domain_name" {
  description = "The domain name"
  value       = var.domain_name
}