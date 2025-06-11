import { EventHandlerRequest, H3Event, setResponseStatus } from 'h3'
import { OsoriErrorResponse } from '~/schema/osori'

export function createErrorResponse (e: H3Event<EventHandlerRequest>, response: OsoriErrorResponse) {
  setResponseStatus(e, Number(response.code))

  const errors = response.messageList.errors || []

  return {
    message: errors[0]?.message,
    ...(errors[0]?.detailInfo ?? {})
  }
}
