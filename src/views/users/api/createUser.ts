import { codes, handleError, /* randomFail, */ sleep } from '@/utils'
import type { User, CreateUserInput } from '../types'
import type { ResponsePromise } from '@/types'

type CreateUserData = User | null
type CreateUserResponsePromise = ResponsePromise<CreateUserData>
type CreateUser = (input: CreateUserInput) => CreateUserResponsePromise

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://jsonplaceholder.typicode.com'

/* ========================================================================

======================================================================== */

export const createUser: CreateUser = async (requestData) => {
  try {
    // Simulate a slow response.
    await sleep(1500)

    // if (randomFail(0.5)) {
    //   throw new Error('The request randomly failed.')
    // }

    const res = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    if (!res.ok) {
      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: `The request failed with a status of ${res.status}.`,
        success: false
      }
    }

    const json = (await res.json()) as CreateUserData

    // Normally, this entire object would be coming directly from the server.
    // However, because we're using json-server, we have to fake it and construct
    // it in the client-side API function.
    return {
      code: codes.CREATED,
      data: json,
      message: 'success',
      success: true
    }
  } catch (err) {
    if (err instanceof Error) {
      return handleError(err, err.message)
    }
    return handleError(err)
  }
}
