resource "vercel_project" "this" {
  name           = var.app_name
  framework      = var.framework
  root_directory = var.root_directory
}

resource "vercel_project_environment_variable" "this" {
  for_each = var.environment_variables

  project_id = vercel_project.this.id
  key        = each.key
  value      = each.value
  target     = ["production", "preview", "development"]
}

