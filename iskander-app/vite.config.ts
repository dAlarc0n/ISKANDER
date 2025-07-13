import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      routes(defineRoutes){
        return defineRoutes((route)=>{
          route("","routes/login/route.tsx",{index:true});
          route("dashboard","routes/dashboard/layout.tsx",()=>{
            route("","routes/dashboard/admin/route.tsx",{index:true})
            route("courses","routes/dashboard/admin/courses/route.tsx")
            route("courses/:id","routes/dashboard/admin/courses/[id]/route.tsx")
            route("courses/:id/forum/:forumId","routes/dashboard/admin/courses/[id]/forum/[forumId]/route.tsx")
            route("courses/:id/forum/:forumId/post/:postId","routes/dashboard/admin/courses/[id]/forum/[forumId]/post/[postId]/route.tsx")
            route("users","routes/dashboard/admin/users/route.tsx")
          })
          route("/api/course/create","routes/api/course/create/route.tsx")
          route("/api/course/enrollment","routes/api/course/enrollment/route.tsx")
          route("/api/course/content","routes/api/course/content/route.tsx")
          route("/api/course/update/:course_id","routes/api/course/update/route.tsx")
          route("/api/user/create","routes/api/user/create/route.tsx")
          route("/api/course/edit","routes/api/course/edit/route.tsx")
          route("/api/course/delete","routes/api/course/delete/route.tsx")
          route("/api/user/update/:user_id","routes/api/user/update/route.tsx")
          route("/logout","routes/logout/route.tsx")
        })
      }
    }),
    tsconfigPaths(),
  ],
});
