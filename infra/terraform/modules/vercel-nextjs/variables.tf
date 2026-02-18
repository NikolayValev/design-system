variable "app_name" {
  description = "Vercel project name."
  type        = string
}

variable "root_directory" {
  description = "Relative path to app root in monorepo."
  type        = string
}

variable "framework" {
  description = "Framework slug used by Vercel."
  type        = string
  default     = "nextjs"
}

variable "environment_variables" {
  description = "Environment variables synced to Vercel project."
  type        = map(string)
  default     = {}
}

