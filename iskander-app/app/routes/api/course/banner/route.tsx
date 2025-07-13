import type { ActionFunctionArgs } from "@remix-run/node"
import { currentToken } from "~/services/auth.server"
import axios from "~/services/axios.server"

export const action = async ({ request }: ActionFunctionArgs) => {
  const token = await currentToken({ request })
  if (!token) return null

  const formData = await request.formData()

  const id = formData.get("id")
  const type = formData.get("type")
  const file = formData.get("file") as File | null

  const payload = new FormData()
  payload.append("type", type as string)
  if (file) payload.append("file", file)

  try {
    const response = await axios.post(`/api/course/banner/${id}`, payload, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    return response
  } catch (e: any) {
    return e.response
  }
}
