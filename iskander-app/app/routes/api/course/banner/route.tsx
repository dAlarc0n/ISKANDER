import type { ActionFunctionArgs } from "@remix-run/node"
import { currentToken } from "~/services/auth.server"
import axios from "~/services/axios.server"

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const token = await currentToken({ request })
  if (!token) return null

  const courseId = params.courseId
  const formData = await request.formData()

  const payload = new FormData()
  const file = formData.get("file") as File | null

  if (file) payload.append("file", file)

  try {
    const response = await axios.post(`/api/course/banner`, payload, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    return response
  } catch (e: any) {
    return e.response
  }
}

