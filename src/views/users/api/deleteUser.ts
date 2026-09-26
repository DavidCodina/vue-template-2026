import {
  codes,
  handleError
  // sleep
  // randomFail,
} from '@/utils'
import type { User } from '../types'
import type { ResponsePromise } from '@/types'

type DeleteUserData = User | null
type DeleteUserResponsePromise = ResponsePromise<DeleteUserData>
type DeleteUser = (id: string) => DeleteUserResponsePromise

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_API_BASE_URL
    : 'https://jsonplaceholder.typicode.com'

/* ========================================================================

======================================================================== */

export const deleteUser: DeleteUser = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE'
    })

    if (!res.ok) {
      return {
        code: codes.INTERNAL_SERVER_ERROR,
        data: null,
        message: `The request failed with a status of ${res.status}.`,
        success: false
      }
    }

    const json = (await res.json()) as DeleteUserData

    return {
      code: codes.DELETED,
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
