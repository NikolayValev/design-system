variable "service_name" {
  description = "FastAPI service name."
  type        = string
}

variable "image_tag" {
  description = "Container image tag to deploy."
  type        = string
}

variable "port" {
  description = "Container port for FastAPI."
  type        = number
  default     = 8000
}

variable "cpu" {
  description = "App Runner CPU units (1024 or 2048)."
  type        = string
  default     = "1024"
}

variable "memory" {
  description = "App Runner memory in MB (2048 or 3072)."
  type        = string
  default     = "2048"
}

variable "health_check_path" {
  description = "Health check path exposed by FastAPI."
  type        = string
  default     = "/health"
}

variable "environment_variables" {
  description = "Runtime environment variables for FastAPI."
  type        = map(string)
  default     = {}
}

