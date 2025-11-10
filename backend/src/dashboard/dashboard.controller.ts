import { Controller, Get } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("overview")
  async getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get("trends")
  async getTrends() {
    return this.dashboardService.getTrends();
  }

  @Get("alerts")
  async getAlerts() {
    return this.dashboardService.getAlerts();
  }
}
