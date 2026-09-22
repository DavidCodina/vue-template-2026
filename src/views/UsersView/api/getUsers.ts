import { codes, handleError, /* randomFail, */ sleep } from '@/utils'
import type { User } from '../types'
import type { ResponsePromise } from '@/types'

type GetUsersData = User[] | null
type GetUsersResponsePromise = ResponsePromise<GetUsersData>
type GetUsers = () => GetUsersResponsePromise

/* ========================================================================

======================================================================== */

export const getUsers: GetUsers = async () => {
  try {
    // Simulate a slow response.
    await sleep(1500)

    // if (randomFail(0.5)) {
    //   throw new Error('The request randomly failed.')
    // }

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`)

    if (!res.ok) {
      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: `The request failed with a status of ${res.status}.`,
        success: false
      }
    }

    const json = (await res.json()) as GetUsersData

    // Normally, this entire object would be coming directly from the server.
    // However, because we're using json-server, we have to fake it and construct
    // it in the client-side API function.
    return {
      code: codes.OK,
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
