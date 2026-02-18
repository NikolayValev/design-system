# Terraform Platform IaC

This Terraform stack standardizes infrastructure across:

- Next.js frontends (Game, Second Brain, Strata) on Vercel
- Python/FastAPI backends on AWS App Runner + ECR

## Layout

- `main.tf`: Instantiates frontend and backend modules via maps.
- `modules/vercel-nextjs`: Vercel project + environment variables.
- `modules/fastapi-apprunner`: ECR + App Runner service for FastAPI.
- `environments/*/terraform.tfvars.example`: Example per-environment values.

## Prerequisites

- Terraform `>= 1.6.0`
- AWS credentials in environment (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, optional `AWS_SESSION_TOKEN`)
- Vercel token in environment (`VERCEL_API_TOKEN`)

## Quick Start

```bash
cd infra/terraform
cp environments/preview/terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
```

## Apply Production

```bash
cd infra/terraform
cp environments/production/terraform.tfvars.example terraform.tfvars
terraform init
terraform apply
```

## Notes

- Terraform creates deployment targets. Image build/push for FastAPI should happen in CI before `terraform apply`.
- Keep secrets in CI secret stores or secret managers, not in `terraform.tfvars`.

