variable "aws_region" {
  description = "AWS region used for FastAPI backends."
  type        = string
  default     = "us-east-1"
}

variable "frontend_apps" {
  description = "Next.js frontend apps managed in Vercel."
  type = map(object({
    root_directory        = string
    environment_variables = optional(map(string), {})
  }))
  default = {}
}

variable "fastapi_services" {
  description = "FastAPI backend services deployed with AWS App Runner."
  type = map(object({
    image_tag             = string
    port                  = optional(number, 8000)
    cpu                   = optional(string, "1024")
    memory                = optional(string, "2048")
    health_check_path     = optional(string, "/health")
    environment_variables = optional(map(string), {})
  }))
  default = {}
}

