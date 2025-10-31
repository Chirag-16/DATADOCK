provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = "my-college-project-rg"
  location = "eastus"
}

resource "azurerm_container_group" "app" {
  name                = "my-college-app"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  ip_address_type     = "Public"
  os_type             = "Linux"

  container {
    name   = "my-app"
    image  = "your-docker-image"  # Update with your image
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 80
      protocol = "TCP"
    }
  }
}