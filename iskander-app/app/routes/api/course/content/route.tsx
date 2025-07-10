import type { ActionFunctionArgs } from "@remix-run/node"
import { currentToken } from "~/services/auth.server"
import axios from "~/services/axios.server"

export const action = async ({ request }: ActionFunctionArgs) => {
  const token = await currentToken({ request })
  if (!token) return null

  const formData = await request.formData()

  const id = formData.get("id")
  const title = formData.get("title")
  const description = formData.get("description")
  const type = formData.get("type")
  const isVisible = formData.get("isVisible")
  const file = formData.get("file") as File | null

  const payload = new FormData()
  payload.append("title", title as string)
  payload.append("description", description as string)
  payload.append("type", type as string)
  payload.append("isVisible", isVisible as string)
  if (file) payload.append("file", file)

  try {
    const response = await axios.post(`/api/course/content/${id}`, payload, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    return response
  } catch (e: any) {
    return e.response
  }
}
