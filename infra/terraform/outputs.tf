output "frontend_projects" {
  description = "Vercel projects for frontend apps."
  value = {
    for app_name, app in module.frontend_apps : app_name => {
      id   = app.project_id
      name = app.project_name
    }
  }
}

output "fastapi_services" {
  description = "App Runner services for FastAPI backends."
  value = {
    for service_name, service in module.fastapi_services : service_name => {
      service_arn = service.service_arn
      service_url = service.service_url
      repository  = service.repository_url
    }
  }
}

