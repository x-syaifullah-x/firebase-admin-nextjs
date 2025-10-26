import { _auth, _firestore } from "@/lib/firebase"
import { KEY_X_USER_ID } from "@/middleware"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json()

    if (!username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const users = _firestore.collection("users")

    const username_is_exist = !(await users.where("username", "==", username).get()).empty
    if (username_is_exist) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      )
    }

    const uid = req.headers.get(KEY_X_USER_ID) || ""
    const user = await _auth.getUser(uid)
    const creationTimeStr = user.metadata.creationTime
    const creationDate = new Date(creationTimeStr)
    const createdAt = creationDate.getTime()
    await users.doc(user.uid).create({
      username: username,
      createdAt: createdAt,
      updatedAt: new Date().getTime(),
    })

    return NextResponse.json({ message: "User data saved", uid: uid })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { username } = await req.json()

    if (!username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }


    const users = _firestore.collection("users")

    const uid = req.headers.get(KEY_X_USER_ID) || "aaa"

    const exists = (await users.doc(uid).get()).exists
    if (!exists) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 404 }
      )
    }

    const username_exists = !(await users.where("username", "==", username).get()).empty
    if (username_exists) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      )
    }

    await users.doc(uid).set({
      username: username,
      updatedAt: new Date().getTime(),
    })

    return NextResponse.json({ message: "User data saved", uid: uid })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}