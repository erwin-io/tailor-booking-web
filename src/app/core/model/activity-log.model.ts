import { Role } from "./role.model";
import { User } from "./user.model";

export class ActivityLog {
  activityLogId: string;
  date: Date;
  os: string;
  osVersion: string;
  browser: string;
  activityType: ActivityType;
  user: { 
    userId: string; 
    username: string; 
    staff: {
      staffId: string;
      name: string;
    }[],
    role: Role
  };
}
export class ActivityType {
  activityTypeId: string;
  name: string;
}
