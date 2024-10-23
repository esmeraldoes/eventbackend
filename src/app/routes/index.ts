import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { EventRoutes } from '../modules/event/event.route';

import { UserRoutes } from '../modules/user/user.route';
import { AdminRoutes } from '../modules/admin/admin.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
 
  {
    path: '/events',
    route: EventRoutes,
  },
  
 
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
