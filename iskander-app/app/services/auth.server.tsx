import { createCookieSessionStorage, redirect } from "@remix-run/node";
import axios from "./axios.server";

let storage = createCookieSessionStorage({
  cookie: {
    name: "iskander_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET || "default"],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function login({ request, identifier, password }: any) {
  let response;
  let session = await storage.getSession(request.headers.get("Cookie"));
  try {
    let credentials = identifier.includes("@")
  ? { email: identifier, password }
  : { name: identifier, password };
    response = await axios.post("/api/login", credentials);
  } catch (error: any) {
    if (error.response !== undefined) {
      if (error.response.status === 400) {
        return { errors: error.response.data.title + " | " + error.response.data.message };
      }
    }
    return { errors: "Credenciales Inválidas" };
  }

  session.set("userToken", response.data.token);

  return {
    redirector: redirect("/dashboard", {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    }),
  };
}

export async function logout({ request }: any) {
  const session = await storage.getSession(request.headers.get("Cookie"));

  let token = session.get("userToken");
  await axios.post(
    "/api/logout",
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function currentToken({ request }: any) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return session.get("userToken");
}

export async function user({ request }: any) {
  let response;
  let token = await currentToken({ request });
  try {
    response = await axios.get("/api/user", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    return null;
  }
  return response.data;
}
export async function users({ request }: any) {
  let response;
  let token = await currentToken({ request });
  try {
    response = await axios.get("/api/users", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    return null;
  }
  return response.data;
}
export async function categories({ request }: any) {
  let response;
  let token = await currentToken({ request });
  try {
    response = await axios.get("/api/categories", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    return null;
  }
  return response.data;
}
export async function courses({ request }: any) {
  let response;
  let token = await currentToken({ request });
  try {
    response = await axios.get("/api/courses", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    return null;
  }
  return response.data;
}

export async function courseDetail({ request, id }: any) {
  let response;
  let token = await currentToken({ request });
  try {
    response = await axios.get(`/api/course/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    return null;
  }
  return response.data;
}

export async function courseUser({ request, id }: any) {
  let response;
  let token = await currentToken({ request });
  try {
    response = await axios.get(`/api/course/user/${id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    return null;
  }
  return response.data;
}

export async function options({ request }: any) {
  let response;
  let token = await currentToken({ request });
  try {
    response = await axios.get("/api/user/option", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    return null;
  }
  return response.data;
}

export async function requireGuest({ request }: any) {
  if (await user({ request })) {
    console.log('aqui')
    throw redirect("/dashboard");
  }
}

export async function requireAuth({ request }: any) {
  if (!await user({ request })) {
    throw redirect("/login");
  }
}

export async function redirectLoginOrDashBoard({request}:any){
  if (!await user({ request })) {
    throw redirect("/login");
  }else{
    throw redirect("/dashboard");
  }
}
