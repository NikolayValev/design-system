module "frontend_apps" {
  for_each = var.frontend_apps
  source   = "./modules/vercel-nextjs"

  app_name              = each.key
  root_directory        = each.value.root_directory
  environment_variables = each.value.environment_variables
}

module "fastapi_services" {
  for_each = var.fastapi_services
  source   = "./modules/fastapi-apprunner"

  service_name          = each.key
  image_tag             = each.value.image_tag
  port                  = each.value.port
  cpu                   = each.value.cpu
  memory                = each.value.memory
  health_check_path     = each.value.health_check_path
  environment_variables = each.value.environment_variables
}

