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

variable "environment_variables_sensitive" {
  description = "Whether the synced environment variables should be stored as sensitive in Vercel."
  type        = bool
  default     = false
}

