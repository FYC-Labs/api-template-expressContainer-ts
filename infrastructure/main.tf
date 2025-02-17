### 🎯 Define Variables ###
variable "project_id" {
  description = "The GCP project ID"
  type        = string
  default     = "{{project_id}}"
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "us-central1"
}

### 🌐 Providers ###
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = ">= 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

### 🌐 Enable Required GCP APIs ###
resource "google_project_service" "cloud_sql" {
  project            = var.project_id
  service            = "sqladmin.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "firebase" {
  project            = var.project_id
  service            = "firebase.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "identity_platform" {
  project            = var.project_id
  service            = "identitytoolkit.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_functions" {
  project            = var.project_id
  service            = "cloudfunctions.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_storage" {
  project            = var.project_id
  service            = "storage.googleapis.com"
  disable_on_destroy = false
}

### 🚀 Cloud SQL Instances ###
resource "google_sql_database_instance" "sql-prod" {
  name             = "sql-prod"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier              = "db-g1-small"
    availability_type = "ZONAL"
    disk_type         = "PD_SSD"
    disk_size         = 10
    disk_autoresize   = true

    backup_configuration {
      enabled    = true
      start_time = "03:00"
    }
  }

  deletion_protection = true

  lifecycle {
    prevent_destroy = true
    ignore_changes  = all
  }
}

resource "google_sql_database_instance" "sql-qa" {
  name             = "sql-qa"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-f1-micro"
  }

  lifecycle {
    prevent_destroy = true
    ignore_changes  = all
  }
}

### ✅ Firebase Authentication ###
resource "google_identity_platform_config" "auth" {
  project = var.project_id

  lifecycle {
    prevent_destroy = true
    ignore_changes  = all
  }
}

### 🌐 Firebase Hosting Sites ###
resource "google_firebase_hosting_site" "prod" {
  project  = var.project_id
  site_id  = "${var.project_id}-prod"
  provider = google-beta

  lifecycle {
    prevent_destroy = true
    ignore_changes  = all
  }
}

resource "google_firebase_hosting_site" "qa" {
  project  = var.project_id
  site_id  = "${var.project_id}-qa"
  provider = google-beta

  lifecycle {
    prevent_destroy = true
    ignore_changes  = all
  }
}

### 🗂️ Firebase Storage Bucket ###
resource "google_storage_bucket" "firebase_storage" {
  name                        = "${var.project_id}.firebasestorage.app"
  location                    = var.region
  uniform_bucket_level_access = true
  storage_class               = "REGIONAL"

  lifecycle {
    prevent_destroy = true
  }
}


### 🌐 Enable Cloud Run and VPC Access APIs ###
resource "google_project_service" "cloud_run" {
  project            = var.project_id
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "vpc_access" {
  project            = var.project_id
  service            = "vpcaccess.googleapis.com"
  disable_on_destroy = false
}

### 🌉 VPC Network ###
resource "google_compute_network" "main" {
  name                    = "main-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "main" {
  name          = "main-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.main.id
}

### 🔌 VPC Connector ###
resource "google_vpc_access_connector" "main" {
  name          = "main-vpc-connector"
  region        = var.region
  network       = google_compute_network.main.name
  ip_cidr_range = "10.8.0.0/28"
  machine_type  = "e2-micro"
  min_instances = 2
  max_instances = 3
}
