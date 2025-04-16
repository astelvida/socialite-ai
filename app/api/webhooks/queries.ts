"use server"

import client from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const getCurrentUser = async () => {
  const user = await currentUser()
  // console.log("currentUser", user)
  const userId = user?.id ?? ""
  // console.log("user", user)
  return userId
}

export const getInstagramUser = async (id: string) => {
  const response = await fetch(
    `https://graph.instagram.com/${id}?fields=id,username&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
  )
  const data = await response.json()
  console.log("INSTAGRAM USER")
  console.dir(data, { depth: 5 })
  return data
}

export const getInstagramUserMedia = async (id: string) => {
  const response = await fetch(
    `https://graph.instagram.com/${id}/media?fields=id,media_type,media_url,username&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
  )
  const data = await response.json()

  console.log("INSTAGRAM DATA")
  console.dir(data, { depth: 5 })
  return data
}

export const matchKeyword = async (testKeyword: string) => {
  const keyword = await client.keyword.findFirst({
    where: {
      OR: [
        {
          word: {
            equals: testKeyword,
            mode: "insensitive",
          },
        },
      ],
    },
  })

  if (!keyword) {
    return false
  }

  return true
}
