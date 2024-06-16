import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { sidebarLinks } from "./constants";

const routes = sidebarLinks.map(link => link.route);
routes.push('/meetin(.*)');

const protectedRoutes = createRouteMatcher(routes);

export default clerkMiddleware((auth, req) => {
    if(protectedRoutes(req)) auth().protect();
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};