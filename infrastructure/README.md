## **1. Using AWS Default Credentials for Terraform**

### **Steps**:

1. **Configure AWS Credentials**:
   Run the following command to configure the AWS CLI:
   ```bash
   aws configure
   ```
   Enter the necessary details (Access Key, Secret Key, Region, and Output format).

2. **Run Terraform**:
   cd to infrastructure directory and run terraform commands.
   ```bash
   cd infrastructure
   ```

   ```bash
   terraform plan
   ```
---

## 2. Use Arn of IAM Role

To run Terraform commands (e.g., `plan`, `apply`, `destroy`) from the root directory, follow these steps:

### Steps:

1. **Navigate to the Root Directory**:
   Ensure you're in the root directory of the project.

2. **Configure AWS Credentials (Optional)**:
   Run `aws configure` to login aws cli

3. **Run Terraform via Yarn if you have created a IAM ROLE with needed Permissions**:
   Run the following command to execute Terraform:

   ```bash
   yarn terraform <terraform-command>
   ```
   and paste the ARN of the IAM role when prompted

   For example, to execute the `plan` command:
   ```bash
   yarn terraform plan
   ```
---
### **Troubleshooting**:

- **Permission Denied on Script**: If you get a `permission denied` error while running the shell script, ensure that the script is executable:
   ```bash
   chmod +x ./script.sh
   ```