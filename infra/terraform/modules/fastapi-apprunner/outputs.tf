output "service_arn" {
  description = "AWS App Runner service ARN."
  value       = aws_apprunner_service.this.arn
}

output "service_url" {
  description = "Public URL for FastAPI service."
  value       = aws_apprunner_service.this.service_url
}

output "repository_url" {
  description = "ECR repository URL used by the service."
  value       = aws_ecr_repository.this.repository_url
}

