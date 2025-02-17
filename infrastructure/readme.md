# FYC Terraform

### 📌 Prerequisites:
Ensure **Terraform** and **Terraformer** are installed:
```sh
# Install Terraform
brew install terraform

# Install Terraformer (without Go)
curl -LO https://github.com/GoogleCloudPlatform/terraformer/releases/latest/download/terraformer-darwin-arm64
chmod +x terraformer-darwin-arm64
sudo mv terraformer-darwin-arm64 /usr/local/bin/terraformer
```
---
### Add Project ID to main.tf
Replace `{{project-id}}` with your GCP/Fireabse project ID.

### 🧑‍💻 Run Infraprep Script
```sh
  yarn infra
```